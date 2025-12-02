import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  BorderStyle,
  WidthType,
  ImageRun,
  VerticalAlign,
} from "docx";
import fs from "fs";
import path from "path";

// Enhanced HTML to Paragraphs parser - WITH TABLE SUPPORT
function parseHtmlToParagraphs(html: string | null): Array<Paragraph | Table> {
  if (!html) return [new Paragraph({})];

  const paragraphs: Array<Paragraph | Table> = [];
  
  // Helper: Convert number to Roman numerals
  function toRoman(num: number): string {
    const map: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, numeral] of map) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  }
  
  // Helper: Generate list marker based on type
  function getListMarker(type: string, index: number): string {
    switch (type) {
      case 'lower-alpha': return `${String.fromCharCode(96 + index)}. `;
      case 'upper-alpha': return `${String.fromCharCode(64 + index)}. `;
      case 'lower-roman': return `${toRoman(index).toLowerCase()}. `;
      case 'upper-roman': return `${toRoman(index)}. `;
      case 'decimal': return `${index}. `;
      default: return `${index}. `;
    }
  }
  
  // Helper: Clean text from HTML tags
  function cleanHtml(text: string): string {
    return text
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }
  
  // Helper: Parse inline formatting (bold, italic, underline)
  function parseInlineText(text: string): TextRun[] {
    const runs: TextRun[] = [];
    let cleanedText = text.replace(/^<p[^>]*>|<\/p>$/gi, '').trim();
    const parts = cleanedText.split(/(<\/?(?:strong|b|em|i|u|p)[^>]*>)/gi);
    
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    
    for (const part of parts) {
      if (!part) continue;
      
      if (/<(strong|b)[^>]*>/i.test(part)) {
        isBold = true;
      } else if (/<\/(strong|b)>/i.test(part)) {
        isBold = false;
      } else if (/<(em|i)[^>]*>/i.test(part)) {
        isItalic = true;
      } else if (/<\/(em|i)>/i.test(part)) {
        isItalic = false;
      } else if (/<u[^>]*>/i.test(part)) {
        isUnderline = true;
      } else if (/<\/u>/i.test(part)) {
        isUnderline = false;
      } else if (/<\/?p[^>]*>/i.test(part)) {
        continue;
      } else if (!/^</.test(part)) {
        const cleanText = cleanHtml(part);
        
        if (cleanText) {
          runs.push(new TextRun({
            text: cleanText,
            font: "Arial",
            size: 20,
            bold: isBold,
            italics: isItalic,
            underline: isUnderline ? {} : undefined,
          }));
        }
      }
    }
    
    return runs;
  }
  
  // Helper: Extract list style type from ol tag
  function extractListStyleType(olTag: string): string {
    const dataStyleMatch = olTag.match(/data-list-style=["']([^"']+)["']/i);
    if (dataStyleMatch) {
      return dataStyleMatch[1];
    }
    
    const styleMatch = olTag.match(/style=["'][^"']*list-style-type:\s*([^;"']+)[^"']*["']/i);
    if (styleMatch) {
      return styleMatch[1].trim();
    }
    
    const classMatch = olTag.match(/class=["'][^"']*list-style-([^"'\s]+)[^"']*["']/i);
    if (classMatch) {
      return classMatch[1];
    }
    
    return 'decimal';
  }
  
  // ✅ NEW: Process table element with gray header background
  function processTable(tableHtml: string): Table {
    console.log('   📊 Processing table');
    
    const rows: TableRow[] = [];
    
    // Extract all <tr> elements
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    let rowIndex = 0;
    
    while ((trMatch = trRegex.exec(tableHtml)) !== null) {
      const trContent = trMatch[1];
      const cells: TableCell[] = [];
      
      // Check if this row contains <th> elements (header row)
      const hasHeaders = /<th[^>]*>/i.test(trContent);
      
      // Extract all <td> and <th> elements
      const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
      let cellMatch;
      
      while ((cellMatch = cellRegex.exec(trContent)) !== null) {
        const isHeader = cellMatch[1].toLowerCase() === 'th';
        const cellContent = cellMatch[2];
        const cellText = cleanHtml(cellContent);
        
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText || '',
                    font: "Arial",
                    size: 20,
                    bold: isHeader,
                  }),
                ],
                alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
            // ✅ Add gray background for header cells
            shading: isHeader ? {
              fill: "D3D3D3", // Light gray color (same as Tiptap)
              val: "clear",
              color: "auto",
            } : undefined,
          })
        );
      }
      
      if (cells.length > 0) {
        rows.push(new TableRow({ children: cells }));
      }
      
      rowIndex++;
    }
    
    console.log(`   ✅ Table with ${rows.length} rows`);
    
    return new Table({
      rows: rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
      },
    });
  }
  
  // ✅ NEW: Process image element with base64 support
  function processImage(imgTag: string): Paragraph {
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']+)["']/i);
    const widthMatch = imgTag.match(/width=["']?(\d+)["']?/i);
    const heightMatch = imgTag.match(/height=["']?(\d+)["']?/i);
    
    const alt = altMatch ? altMatch[1] : 'Image';
    const src = srcMatch ? srcMatch[1] : '';
    
    console.log(`   🖼️ Image found: ${alt}`);
    console.log(`      Source type: ${src.startsWith('data:') ? 'base64 data URL' : 'external URL'}`);
    
    // Handle base64 data URLs (from Tiptap paste)
    if (src.startsWith('data:image/')) {
      try {
        // Extract the base64 data
        const base64Match = src.match(/^data:image\/([^;]+);base64,(.+)$/);
        if (base64Match) {
          const imageType = base64Match[1]; // png, jpeg, gif, etc.
          const base64Data = base64Match[2];
          
          // Convert base64 to buffer
          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          // Calculate dimensions (max 600px width for document)
          let width = widthMatch ? parseInt(widthMatch[1]) : 600;
          let height = heightMatch ? parseInt(heightMatch[1]) : 400;
          
          // Scale down if too large
          if (width > 600) {
            const ratio = 600 / width;
            width = 600;
            height = Math.floor(height * ratio);
          }
          
          console.log(`   ✅ Base64 image loaded: ${width}x${height}px, type: ${imageType}`);
          
          // Map image type for docx
          let docxType: "jpg" | "png" | "gif" | "bmp" = "png";
          if (imageType === "jpeg" || imageType === "jpg") docxType = "jpg";
          else if (imageType === "png") docxType = "png";
          else if (imageType === "gif") docxType = "gif";
          else if (imageType === "bmp") docxType = "bmp";
          
          return new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: width,
                  height: height,
                },
                type: docxType,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          });
        }
      } catch (error) {
        console.error(`   ❌ Error processing base64 image:`, error);
      }
    }
    
    // Fallback for non-base64 images or errors
    console.log(`   ⚠️ Image cannot be embedded (only base64 data URLs are supported)`);
    return new Paragraph({
      children: [
        new TextRun({ 
          text: `[📷 Image: ${alt}]`,
          italics: true,
          color: "666666",
          font: "Arial",
          size: 20,
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    });
  }
  
  // Track processed ranges to avoid duplicates
  const processedRanges: Array<{ start: number; end: number }> = [];
  
  function isOverlapping(start: number, end: number): boolean {
    return processedRanges.some(range => 
      (start >= range.start && start < range.end) || 
      (end > range.start && end <= range.end) ||
      (start <= range.start && end >= range.end)
    );
  }
  
  // ✅ Find all top-level elements and their positions
  const elements: Array<{ 
    type: string; 
    index: number; 
    length: number; 
    match: RegExpExecArray | null; 
    content?: string 
  }> = [];
  
  // Find all <p> tags
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(html)) !== null) {
    elements.push({ 
      type: 'p', 
      index: pMatch.index, 
      length: pMatch[0].length,
      match: pMatch 
    });
  }
  
  // Find all <ol> tags
  const olRegex = /<ol([^>]*)>([\s\S]*?)<\/ol>/gi;
  let olMatch;
  while ((olMatch = olRegex.exec(html)) !== null) {
    elements.push({ 
      type: 'ol', 
      index: olMatch.index, 
      length: olMatch[0].length,
      match: olMatch 
    });
  }
  
  // Find all <ul> tags
  const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  let ulMatch;
  while ((ulMatch = ulRegex.exec(html)) !== null) {
    elements.push({ 
      type: 'ul', 
      index: ulMatch.index, 
      length: ulMatch[0].length,
      match: ulMatch 
    });
  }
  
  // ✅ NEW: Find all <img> tags
  const imgRegex = /<img[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    elements.push({ 
      type: 'img', 
      index: imgMatch.index, 
      length: imgMatch[0].length,
      match: null,
      content: imgMatch[0]
    });
  }
  
  // ✅ NEW: Find all <table> tags
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    elements.push({ 
      type: 'table', 
      index: tableMatch.index, 
      length: tableMatch[0].length,
      match: null,
      content: tableMatch[0]
    });
  }
  
  // Sort by position in HTML
  elements.sort((a, b) => a.index - b.index);
  
  console.log(`📋 Found ${elements.length} elements`);
  
  // ✅ Process each element in order
  elements.forEach((element, idx) => {
    
    if (element.type === 'ol') {
      // ✅ Skip if overlapping (for nested lists)
      if (isOverlapping(element.index, element.index + element.length)) {
        console.log(`   ⏭️ Skipping overlapping ${element.type} at position ${element.index}`);
        return;
      }
      
      const olTag = element.match![1] || '';
      const olContent = element.match![2];
      const listStyleType = extractListStyleType('<ol' + olTag + '>');
      
      console.log(`${idx + 1}. 🔢 Ordered list (${listStyleType})`);
      
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const items: string[] = [];
      let liMatch;
      
      while ((liMatch = liRegex.exec(olContent)) !== null) {
        items.push(liMatch[1]);
      }
      
      items.forEach((liContent, itemIdx) => {
        const index = itemIdx + 1;
        const marker = getListMarker(listStyleType, index);
        const runs = parseInlineText(liContent);
        
        if (runs.length > 0) {
          runs.unshift(new TextRun({
            text: marker,
            font: "Arial",
            size: 20,
          }));
          
          paragraphs.push(new Paragraph({
            children: runs,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 100 },
            indent: { left: 720, hanging: 360 },
          }));
          
          const preview = cleanHtml(liContent).substring(0, 30);
          console.log(`   ${marker}${preview}`);
        }
      });
      
      processedRanges.push({
        start: element.index,
        end: element.index + element.length
      });
      
    } else if (element.type === 'ul') {
      // ✅ Skip if overlapping (for nested lists)
      if (isOverlapping(element.index, element.index + element.length)) {
        console.log(`   ⏭️ Skipping overlapping ${element.type} at position ${element.index}`);
        return;
      }
      
      const ulContent = element.match![1];
      
      console.log(`${idx + 1}. 🔘 Unordered list`);
      
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const items: string[] = [];
      let liMatch;
      
      while ((liMatch = liRegex.exec(ulContent)) !== null) {
        items.push(liMatch[1]);
      }
      
      items.forEach(liContent => {
        const runs = parseInlineText(liContent);
        
        if (runs.length > 0) {
          runs.unshift(new TextRun({
            text: '• ',
            font: "Arial",
            size: 20,
          }));
          
          paragraphs.push(new Paragraph({
            children: runs,
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 100 },
            indent: { left: 720, hanging: 360 },
          }));
          
          const preview = cleanHtml(liContent).substring(0, 30);
          console.log(`   • ${preview}`);
        }
      });
      
      processedRanges.push({
        start: element.index,
        end: element.index + element.length
      });
      
    } else if (element.type === 'img') {
      // ✅ Images should NEVER be skipped
      console.log(`${idx + 1}. 🖼️ Image element`);
      
      const imageParagraph = processImage(element.content!);
      paragraphs.push(imageParagraph);
      
      // Don't add to processedRanges - images are standalone
      
    } else if (element.type === 'table') {
      // ✅ Tables should NEVER be skipped
      console.log(`${idx + 1}. 📊 Table element`);
      
      const table = processTable(element.content!);
      paragraphs.push(table);
      
      processedRanges.push({
        start: element.index,
        end: element.index + element.length
      });
      
    } else if (element.type === 'p') {
      // ✅ Skip if overlapping (for paragraphs inside lists)
      if (isOverlapping(element.index, element.index + element.length)) {
        console.log(`   ⏭️ Skipping overlapping ${element.type} at position ${element.index}`);
        return;
      }
      
      const pContent = element.match![1];
      const cleaned = cleanHtml(pContent);
      
      // Handle empty paragraphs as line breaks
      if (!cleaned || cleaned === '' || pContent.trim() === '<br>' || pContent.trim() === '<br/>') {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: '', font: "Arial", size: 20 })],
          spacing: { after: 200 },
        }));
        
        console.log(`${idx + 1}. 📝 [empty line]`);
        
        processedRanges.push({
          start: element.index,
          end: element.index + element.length
        });
        return;
      }
      
      const runs = parseInlineText(pContent);
      
      if (runs.length > 0) {
        paragraphs.push(new Paragraph({
          children: runs,
          alignment: AlignmentType.JUSTIFIED,
          spacing: { line: 360, after: 200 },
        }));
        
        const preview = cleaned.substring(0, 30);
        console.log(`${idx + 1}. 📝 ${preview}`);
        
        processedRanges.push({
          start: element.index,
          end: element.index + element.length
        });
      }
    }
  });
  
  console.log(`✅ Total exported: ${paragraphs.length} elements\n`);
  
  return paragraphs.length > 0 ? paragraphs : [new Paragraph({})];
}

// Helper function to load image with error handling
function loadCoverImage(coverImagePath: string | null): {
  buffer: Buffer | null;
  type: "jpg" | "png" | "gif" | "bmp";
  error?: string;
} {
  if (!coverImagePath) {
    return { buffer: null, type: "jpg" };
  }

  try {
    // Handle path - remove leading slash if exists
    let imagePath = coverImagePath.startsWith('/') 
      ? coverImagePath.slice(1) 
      : coverImagePath;
    
    // Build full path from project root
    const fullImagePath = path.join(process.cwd(), "public", imagePath);
    
    console.log("🖼️  Attempting to load cover image from:", fullImagePath);
    
    // Check if file exists
    if (!fs.existsSync(fullImagePath)) {
      console.error("❌ Cover image not found at:", fullImagePath);
      return { 
        buffer: null, 
        type: "jpg", 
        error: "File not found" 
      };
    }
    
    // Read image file
    const imageBuffer = fs.readFileSync(fullImagePath);
    
    // Detect image type from extension
    const ext = path.extname(imagePath).toLowerCase();
    let imageType: "jpg" | "png" | "gif" | "bmp" = "jpg";
    
    if (ext === ".png") imageType = "png";
    else if (ext === ".gif") imageType = "gif";
    else if (ext === ".bmp") imageType = "bmp";
    else if (ext === ".jpg" || ext === ".jpeg") imageType = "jpg";
    
    console.log("✅ Cover image loaded successfully!");
    console.log("   - Type:", imageType);
    console.log("   - Size:", imageBuffer.length, "bytes");
    
    return { buffer: imageBuffer, type: imageType };
  } catch (error) {
    console.error("❌ Error loading cover image:", error);
    return { 
      buffer: null, 
      type: "jpg", 
      error: String(error) 
    };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const torId = parseInt(id);

    const tor = await prisma.tor.findUnique({
      where: { id: torId },
      include: {
        bidang: true,
        creator: {
          include: {
            position: true,
          },
        },
        budgetItems: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    }) as any;

    if (!tor) {
      return NextResponse.json({ message: "ToR not found" }, { status: 404 });
    }

    console.log("📄 Exporting TOR:", tor.title);
    console.log("   - ID:", tor.id);
    console.log("   - 🖼️  Cover Image Path:", tor.coverImage || "(none)");
    console.log("   - Cover Image type:", typeof tor.coverImage);
    console.log("   - Has coverImage:", !!tor.coverImage);
    console.log("   - Cover Image length:", tor.coverImage?.length || 0);

    // Read Logo Images
    const plnLogoPath = path.join(process.cwd(), "public", "logo-pln-horizontal.jpg");
    const secondaryLogoPath = path.join(process.cwd(), "public", "image7.png");
    
    let plnLogoBuffer: Buffer | null = null;
    let secondaryLogoBuffer: Buffer | null = null;

    try {
      plnLogoBuffer = fs.readFileSync(plnLogoPath);
      console.log("✅ PLN Logo loaded");
    } catch (e) {
      console.error("❌ PLN Logo (logo-pln-horizontal.jpg) not found:", e);
    }

    try {
      secondaryLogoBuffer = fs.readFileSync(secondaryLogoPath);
      console.log("✅ Secondary Logo loaded");
    } catch (e) {
      console.error("❌ Secondary Logo (image7.png) not found:", e);
    }

    // Load Cover Image
    const coverImageResult = loadCoverImage(tor.coverImage);

    // Create Cover Image Paragraphs
    const coverImageParagraphs = coverImageResult.buffer 
      ? [
          new Paragraph({
            children: [
              new ImageRun({
                data: coverImageResult.buffer,
                transformation: { 
                  width: 450,  // Width in pixels
                  height: 300  // Height in pixels
                },
                type: coverImageResult.type,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          })
        ]
      : [
          new Paragraph({
            children: [
              new TextRun({
                text: coverImageResult.error 
                  ? "* gambar tidak dapat dimuat" 
                  : "* gambar hanya ilustrasi",
                font: "Times New Roman",
                size: 20,
                italics: true,
                color: coverImageResult.error ? "999999" : undefined,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
          })
        ];

    // Create Document
    const doc = new Document({
      sections: [
        // === SECTION 1: COVER PAGE ===
        {
          properties: {
            page: {
              margin: {
                top: 1701, // ~3cm
                right: 1558, // ~2.75cm
                bottom: 1701, // ~3cm
                left: 2268, // ~4cm
              },
            },
            titlePage: true,
          },
          headers: {
            default: new Header({
              children: [
                new Table({
                  width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                  },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                  },
                  rows: [
                    new TableRow({
                      children: [
                        // Left Logo (PLN)
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            plnLogoBuffer ? new Paragraph({
                              children: [
                                new ImageRun({
                                  data: plnLogoBuffer,
                                  transformation: { width: 80, height: 40 },
                                  type: "jpg",
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
                            }) : new Paragraph(""),
                          ],
                        }),
                        // Center Text
                        new TableCell({
                          width: { size: 60, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Term of Reference (TOR) ${tor.title}`,
                                  font: "Arial",
                                  size: 16,
                                  italics: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        // Right Logo
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            secondaryLogoBuffer ? new Paragraph({
                              children: [
                                new ImageRun({
                                  data: secondaryLogoBuffer,
                                  transformation: { width: 20, height: 28 },
                                  type: "png",
                                }),
                              ],
                              alignment: AlignmentType.RIGHT,
                            }) : new Paragraph(""),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // Spacing
            new Paragraph({ spacing: { before: 2000 } }),

            // TERM OF REFERENCE (TOR)
            new Paragraph({
              children: [
                new TextRun({
                  text: "TERM OF REFERENCE (TOR)",
                  font: "Times New Roman",
                  size: 28,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            // Project Title
            new Paragraph({
              children: [
                new TextRun({
                  text: tor.title,
                  font: "Times New Roman",
                  size: 40,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),

            // Cover Image
            ...coverImageParagraphs,

            // Spacing
            new Paragraph({ spacing: { before: 2000 } }),

            // Bottom Footer Text
            new Paragraph({
              children: [
                new TextRun({
                  text: "PT PLN INDONESIA POWER",
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "UBP CILEGON",
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `TAHUN ${tor.creationYear || new Date().getFullYear()}`,
                  font: "Times New Roman",
                  size: 24,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },

        // === SECTION 2: MAIN CONTENT ===
        {
          properties: {
            page: {
              margin: {
                top: 1701,
                right: 1558,
                bottom: 1701,
                left: 2268,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.SINGLE, size: 6 },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                  },
                  rows: [
                    new TableRow({
                      children: [
                        // Left: Logo + Text
                        new TableCell({
                          width: { size: 80, type: WidthType.PERCENTAGE },
                          children: [
                            plnLogoBuffer ? new Paragraph({
                              children: [
                                new ImageRun({
                                  data: plnLogoBuffer,
                                  transformation: { width: 80, height: 40 },
                                  type: "jpg",
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
                            }) : new Paragraph(""),
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Term of Reference (TOR) ${tor.title}`,
                                  font: "Arial",
                                  size: 16,
                                  italics: true,
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
                              spacing: { before: 100 },
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        // Right: Secondary Logo
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            secondaryLogoBuffer ? new Paragraph({
                              children: [
                                new ImageRun({
                                  data: secondaryLogoBuffer,
                                  transformation: { width: 20, height: 28 },
                                  type: "png",
                                }),
                              ],
                              alignment: AlignmentType.RIGHT,
                            }) : new Paragraph(""),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      children: ["Halaman ", PageNumber.CURRENT, " dari ", PageNumber.TOTAL_PAGES],
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          },
          children: [
            // 1. Pendahuluan
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. PENDAHULUAN",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.introduction),

            // 2. Latar Belakang
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. LATAR BELAKANG",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.background),

            // 3. Tujuan
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. TUJUAN",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.objective),

            // 4. Ruang Lingkup
            new Paragraph({
              children: [
                new TextRun({
                  text: "4. RUANG LINGKUP PEKERJAAN",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.scope),

            // 5. Jangka Waktu
            new Paragraph({
              children: [
                new TextRun({
                  text: "5. JANGKA WAKTU PELAKSANAAN",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: tor.duration 
                    ? `${tor.duration} ${tor.durationUnit === 'days' ? 'Hari Kalender' : tor.durationUnit === 'weeks' ? 'Minggu' : 'Bulan'}`
                    : '-',
                  font: "Arial",
                  size: 20,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { line: 360 },
            }),

            // 6. Spesifikasi Teknis
            new Paragraph({
              children: [
                new TextRun({
                  text: "6. SPESIFIKASI TEKNIS",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.technicalSpec),

            // 7. RAB Table
            new Paragraph({
              children: [
                new TextRun({
                  text: "7. RENCANA ANGGARAN BIAYA (RAB)",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                // Header
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Uraian", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 40, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Vol", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Sat", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Harga Satuan", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Items
                ...tor.budgetItems.map((item: any, index: number) => 
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.item, font: "Arial", size: 20 })] })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.quantity.toString(), font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.unit, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: Number(item.unitPrice).toLocaleString("id-ID"), font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })] }),
                      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: Number(item.totalPrice).toLocaleString("id-ID"), font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })] }),
                    ],
                  })
                ),
                // Grand Total
                new TableRow({
                  children: [
                    new TableCell({ 
                      children: [new Paragraph({ children: [new TextRun({ text: "GRAND TOTAL", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
                      columnSpan: 5,
                    }),
                    new TableCell({ 
                      children: [new Paragraph({ children: [new TextRun({ text: tor.grandTotal ? Number(tor.grandTotal).toLocaleString("id-ID") : "0", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    console.log("✅ Document export successful!");

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="TOR-${tor.number || 'draft'}.docx"`,
      },
    });
  } catch (error) {
    console.error("❌ Export error:", error);
    return NextResponse.json(
      { message: "Failed to export ToR", error: String(error) },
      { status: 500 }
    );
  }
}