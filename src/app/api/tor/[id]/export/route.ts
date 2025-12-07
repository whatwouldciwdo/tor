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
  HeightRule,
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
  
  // Helper: Parse inline formatting (bold, italic, underline, strikethrough)
  function parseInlineText(text: string): TextRun[] {
    const runs: TextRun[] = [];
    let cleanedText = text.replace(/^\u003cp[^\u003e]*\u003e|\u003c\/p\u003e$/gi, '').trim();
    // Split by formatting tags including strikethrough
    const parts = cleanedText.split(/(\u003c\/?(?:strong|b|em|i|u|s|strike|del|p)[^\u003e]*\u003e)/gi);
    
    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    let isStrikethrough = false;
    
    for (const part of parts) {
      if (!part) continue;
      
      if (/\u003c(strong|b)[^\u003e]*\u003e/i.test(part)) {
        isBold = true;
      } else if (/\u003c\/(strong|b)\u003e/i.test(part)) {
        isBold = false;
      } else if (/\u003c(em|i)[^\u003e]*\u003e/i.test(part)) {
        isItalic = true;
      } else if (/\u003c\/(em|i)\u003e/i.test(part)) {
        isItalic = false;
      } else if (/\u003cu[^\u003e]*\u003e/i.test(part)) {
        isUnderline = true;
      } else if (/\u003c\/u\u003e/i.test(part)) {
        isUnderline = false;
      } else if (/\u003c(s|strike|del)[^\u003e]*\u003e/i.test(part)) {
        isStrikethrough = true;
      } else if (/\u003c\/(s|strike|del)\u003e/i.test(part)) {
        isStrikethrough = false;
      } else if (/\u003c\/?p[^\u003e]*\u003e/i.test(part)) {
        continue;
      } else if (!/^\u003c/.test(part)) {
        const cleanText = cleanHtml(part);
        
        if (cleanText) {
          runs.push(new TextRun({
            text: cleanText,
            font: "Arial",
            size: 20,
            bold: isBold,
            italics: isItalic,
            underline: isUnderline ? {} : undefined,
            strike: isStrikethrough,
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
  
  // Process table element with gray header background
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
            // Add gray background for header cells
            shading: isHeader ? {
              fill: "D3D3D3", // Light gray color (same as Tiptap)
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
  
  // Process image element with base64 support
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
  
  // Find all top-level elements and their positions
  const elements: Array<{ 
    type: string; 
    index: number; 
    length: number; 
    match: RegExpExecArray | null; 
    content?: string;
    caption?: string;
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
  
  // Find all <figure> tags (with captions)
  const figureRegex = /<figure[^>]*>([\s\S]*?)<\/figure>/gi;
  let figureMatch;
  while ((figureMatch = figureRegex.exec(html)) !== null) {
    const figureContent = figureMatch[1];
    // Extract img and figcaption from figure
    const imgInFigure = figureContent.match(/<img[^>]*>/i);
    const figcaption = figureContent.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    
    if (imgInFigure) {
      elements.push({ 
        type: 'figure', 
        index: figureMatch.index, 
        length: figureMatch[0].length,
        match: null,
        content: imgInFigure[0],
        caption: figcaption ? figcaption[1] : undefined
      });
    }
  }
  
  // Find standalone <img> tags (without figure wrapper)
  const imgRegex = /<img[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    // Check if this img is inside a figure tag (already processed)
    const isInFigure = elements.some(el => 
      el.type === 'figure' && 
      imgMatch.index >= el.index && 
      imgMatch.index < el.index + el.length
    );
    
    if (!isInFigure) {
      elements.push({ 
        type: 'img', 
        index: imgMatch.index, 
        length: imgMatch[0].length,
        match: null,
        content: imgMatch[0]
      });
    }
  }
  
  // Find all <table> tags
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
  
  // Process each element in order
  elements.forEach((element, idx) => {
    
    if (element.type === 'ol') {
      // Skip if overlapping (for nested lists)
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
      // Skip if overlapping (for nested lists)
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
      // Standalone images (without caption) should NEVER be skipped
      console.log(`${idx + 1}. 🖼️ Image element`);
      
      const imageParagraph = processImage(element.content!);
      paragraphs.push(imageParagraph);
      
      // Don't add to processedRanges - images are standalone
      
    } else if (element.type === 'figure') {
      // Figure with caption
      console.log(`${idx + 1}. 🖼️ Figure with caption`);
      
      // Process image
      const imageParagraph = processImage(element.content!);
      paragraphs.push(imageParagraph);
      
      // Process caption if exists
      if (element.caption) {
        const captionText = cleanHtml(element.caption);
        if (captionText) {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({
                text: captionText,
                font: "Arial",
                size: 18, // Slightly smaller than body text
                italics: true,
                color: "666666",
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }));
          console.log(`   📝 Caption: ${captionText}`);
        }
      }
      
      // Don't add to processedRanges - figures are standalone
      
    } else if (element.type === 'table') {
      // Tables should NEVER be skipped
      console.log(`${idx + 1}. 📊 Table element`);
      
      const table = processTable(element.content!);
      paragraphs.push(table);
      
      processedRanges.push({
        start: element.index,
        end: element.index + element.length
      });
      
    } else if (element.type === 'p') {
      // Skip if overlapping (for paragraphs inside lists)
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
    // ✅ FIX: Normalize path - remove leading slashes
    const normalizedPath = coverImagePath.replace(/^\/+/, '');
    
    // Build full path from project root
    const fullImagePath = path.join(process.cwd(), "public", normalizedPath);
    
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
    const ext = path.extname(normalizedPath).toLowerCase();
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

// Generate Work Stages Gantt Table
function generateWorkStagesTable(workStagesData: any): Table {
  if (!workStagesData || !workStagesData.years || !workStagesData.rows) {
    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("No data available")],
            }),
          ],
        }),
      ],
    });
  }

  const years = workStagesData.years;
  const rows = workStagesData.rows;

  // 1. Header Row 1: No, Deskripsi, Years
  const headerRow1Cells = [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: "No", bold: true, font: "Arial", size: 16, color: "000000" })], alignment: AlignmentType.CENTER })],
      rowSpan: 2,
      verticalAlign: VerticalAlign.CENTER,
      width: { size: 4, type: WidthType.PERCENTAGE },
      shading: { fill: "22D3EE", color: "auto" },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: "Deskripsi", bold: true, font: "Arial", size: 16, color: "000000" })], alignment: AlignmentType.CENTER })],
      rowSpan: 2,
      verticalAlign: VerticalAlign.CENTER,
      width: { size: 20, type: WidthType.PERCENTAGE },
      shading: { fill: "22D3EE", color: "auto" },
    }),
  ];

  // Calculate total months to distribute remaining width
  const totalMonths = years.reduce((acc: number, year: any) => acc + year.months.length, 0);
  const remainingWidth = 76;
  const monthWidth = totalMonths > 0 ? remainingWidth / totalMonths : 0;

  // Add Year headers
  years.forEach((year: any) => {
    headerRow1Cells.push(
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: year.label, bold: true, font: "Arial", size: 16, color: "000000" })], alignment: AlignmentType.CENTER })],
        columnSpan: year.months.length,
        shading: { fill: "22D3EE", color: "auto" },
      })
    );
  });

  // 2. Header Row 2: Months
  const headerRow2Cells: TableCell[] = [];
  years.forEach((year: any) => {
    year.months.forEach((month: string) => {
      headerRow2Cells.push(
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: month, size: 12, font: "Arial", color: "000000" })], alignment: AlignmentType.CENTER })],
          width: { size: monthWidth, type: WidthType.PERCENTAGE },
          shading: { fill: "22D3EE", color: "auto" },
        })
      );
    });
  });

  // 3. Data Rows
  const dataRows = rows.map((row: any) => {
    const cells = [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: row.no.toString(), size: 16, font: "Arial", color: "000000" })], alignment: AlignmentType.CENTER })],
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: row.description, size: 16, font: "Arial", color: "000000" })] })],
      }),
    ];

    // Add schedule cells
    years.forEach((year: any) => {
      year.months.forEach((_: any, monthIdx: number) => {
        const isActive = row.schedule[year.id]?.[monthIdx];
        cells.push(
          new TableCell({
            children: [new Paragraph("")],
            shading: isActive ? { fill: "00FF00", color: "auto" } : undefined,
          })
        );
      });
    });

    return new TableRow({ children: cells });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headerRow1Cells }),
      new TableRow({ children: headerRow2Cells }),
      ...dataRows,
    ],
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

// === TAB 6 LAMPIRAN TABLE GENERATORS ===

// Helper to generate Technical Particular & Guarantee (TPG) Table
function generateTpgTable(items: any[]): Table {
  const cellMargin = { top: 150, bottom: 150, left: 100, right: 100 };
  const headerSize = 24; // 12pt
  const contentSize = 22; // 11pt

  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No.", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Spesifikasi", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 35, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Owner Request", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 30, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Vendor Proposed & Guarantee", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 30, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
      ],
      tableHeader: true,
    }),
    ...items.map((item, index) => 
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Arial", size: contentSize })], alignment: AlignmentType.CENTER })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.specification || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.ownerRequest || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.vendorProposed || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
        ],
      })
    ),
  ];
  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// Helper to generate Inspection Testing Plan (ITP) Table
function generateItpTable(items: any[]): Table {
  const cellMargin = { top: 150, bottom: 150, left: 100, right: 100 };
  const headerSize = 24; // 12pt
  const contentSize = 22; // 11pt

  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No.", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Testing Items", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 18, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Testing Method", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Standard Test Reference", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 17, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Tested by", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 12, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Witness by", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 12, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Acceptance Criteria Requirements", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 21, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
      ],
      tableHeader: true,
    }),
    ...items.map((item, index) => 
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Arial", size: contentSize })], alignment: AlignmentType.CENTER })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.testingItem || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.testingMethod || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.standardTestReference || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.testedBy || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.witnessBy || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.acceptanceCriteria || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
        ],
      })
    ),
  ];
  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// Helper to generate Document Request Sheet (DRS) Table
function generateDrsTable(items: any[]): Table {
  const cellMargin = { top: 150, bottom: 150, left: 100, right: 100 };
  const headerSize = 24; // 12pt
  const contentSize = 22; // 11pt

  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No.", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Document Requirement", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 60, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Document Types", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 35, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
      ],
      tableHeader: true,
    }),
    ...items.map((item, index) => 
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Arial", size: contentSize })], alignment: AlignmentType.CENTER })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.documentRequirement || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.documentType || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
        ],
      })
    ),
  ];
  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// Helper to generate Performance Guarantee Requirement Sheet (PGRS) Table
function generatePgrsTable(items: any[]): Table {
  const cellMargin = { top: 150, bottom: 150, left: 100, right: 100 };
  const headerSize = 24; // 12pt
  const contentSize = 22; // 11pt

  const rows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "No.", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Plant Item", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 19, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Performance Guarantee Parameter (s)", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 19, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Baseline Parameter (s)", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 19, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Verification Method", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 19, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Remedial Measure Allowed", bold: true, font: "Arial", size: headerSize })], alignment: AlignmentType.CENTER })], width: { size: 19, type: WidthType.PERCENTAGE }, margins: cellMargin, shading: { fill: "F3F4F6", color: "auto" } }),
      ],
      tableHeader: true,
    }),
    ...items.map((item, index) => 
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString(), font: "Arial", size: contentSize })], alignment: AlignmentType.CENTER })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.plantItem || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.performanceParameter || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.baselineParameter || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.verificationMethod || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.remedialMeasure || "", font: "Arial", size: contentSize })] })], margins: cellMargin }),
        ],
      })
    ),
  ];
  return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// Generate Lembar Pengesahan Table
function generateLembarPengesahanTable(
  approvalSignatures: any[],
  torTitle: string
): Array<Paragraph | Table> {
  const content: Array<Paragraph | Table> = [];
  
  // Add title (page break handled by section)
  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "LEMBAR PENGESAHAN",
          font: "Arial",
          size: 24,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: torTitle,
          font: "Arial",
          size: 20,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );
  
  // Group signatures by role
  const signaturesByRole = {
    "Dibuat oleh": approvalSignatures.filter(s => s.role === "Dibuat oleh"),
    "Diperiksa oleh": approvalSignatures.filter(s => s.role === "Diperiksa oleh"),
    "Disetujui oleh": approvalSignatures.filter(s => s.role === "Disetujui oleh"),
  };
  
  // Generate table for each signature
  Object.entries(signaturesByRole).forEach(([role, sigs]) => {
    sigs.forEach((sig: any) => {
      const dateText = sig.date ? new Date(sig.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }) : "";
      
      const rows: TableRow[] = [
        // Row 1: Role label
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: role,
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                }),
              ],
              width: { size: 25, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.NONE },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ":",
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 2, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            }),
            new TableCell({
              children: [new Paragraph("")],
              width: { size: 73, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
            }),
          ],
        }),
        // Row 2: Date
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Tanggal",
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                }),
              ],
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.NONE },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: ":",
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: dateText,
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                }),
              ],
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
            }),
          ],
        }),
        // Row 3: Position (centered, merged cell)
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: sig.position || "",
                      font: "Arial",
                      size: 20,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              columnSpan: 3,
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
            }),
          ],
        }),
        // Row 4: Signature space (single empty row with large height)
        new TableRow({
          height: { value: 1700, rule: HeightRule.AT_LEAST },
          children: [
            new TableCell({
              children: [new Paragraph("")],
              columnSpan: 3,
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
            }),
          ],
        }),
        // Row 7: Name (centered, underlined, merged cell)
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: sig.name || "",
                      font: "Arial",
                      size: 20,
                      underline: {},
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
              columnSpan: 3,
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              },
            }),
          ],
        }),
      ];
      
      content.push(
        new Table({
          rows,
          width: { size: 70, type: WidthType.PERCENTAGE },
          alignment: AlignmentType.CENTER,
        }),
        // Add spacing between tables (reduced to fit 1 page)
        new Paragraph({
          children: [new TextRun({ text: "", font: "Arial", size: 20 })],
          spacing: { before: 100, after: 100 },
        })
      );
    });
  });
  
  return content;
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
                  width: 450,
                  height: 300
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
                top: 1701,
                right: 1558,
                bottom: 1701,
                left: 2268,
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
                          margins: {
                            right: 500, // Increased margin to prevent cutoff
                          },
                          children: [
                            secondaryLogoBuffer ? new Paragraph({
                              children: [
                                new ImageRun({
                                  data: secondaryLogoBuffer,
                                  transformation: { width: 20, height: 28 },
                                  type: "png",
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
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
                                  transformation: { width: 136, height: 40 },
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
                                  transformation: { width: 29, height: 41 },
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

            // 5. Garansi
            new Paragraph({
              children: [
                new TextRun({
                  text: "5. GARANSI",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.warranty),

            // 6. Kriteria yang Diterima
            new Paragraph({
              children: [
                new TextRun({
                  text: "6. KRITERIA YANG DITERIMA",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.acceptanceCriteria),

            // 7. TAHAPAN PEKERJAAN & Project Time Schedule
            new Paragraph({
              children: [
                new TextRun({
                  text: "7. TAHAPAN PEKERJAAN & Project Time Schedule",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            generateWorkStagesTable(tor.workStagesData),
            new Paragraph({ children: [], spacing: { after: 200 } }),
            ...parseHtmlToParagraphs(tor.workStagesExplanation),

            // 8. PERSYARATAN PENGIRIMAN
            new Paragraph({
              children: [
                new TextRun({
                  text: "8. PERSYARATAN PENGIRIMAN",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.deliveryRequirements),

            // 9. TITIK SERAH TERIMA
            new Paragraph({
              children: [
                new TextRun({
                  text: "9. TITIK SERAH TERIMA",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.handoverPoint),

            // 10. MEKANISME SERAH TERIMA
            new Paragraph({
              children: [
                new TextRun({
                  text: "10. MEKANISME SERAH TERIMA",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...parseHtmlToParagraphs(tor.handoverMechanism),

            // ✅ 11. USULAN PELAKSANA DIREKSI (line ~1150)
new Paragraph({
  children: [
    new TextRun({
      text: "11. USULAN PELAKSANA DIREKSI PEKERJAAN DAN DIREKSI LAPANGAN",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),

// Parse directorProposals and fieldDirectorProposals
...(() => {
  const directorProposals = tor.directorProposals || [];
  const fieldDirectorProposals = tor.fieldDirectorProposals || [];
  
  // Validate array types
  if (!Array.isArray(directorProposals) || !Array.isArray(fieldDirectorProposals)) {
    return [new Paragraph({ 
      children: [new TextRun({ text: "-", font: "Arial", size: 20 })],
      spacing: { after: 100 }
    })];
  }
  
  // If both are empty
  if (directorProposals.length === 0 && fieldDirectorProposals.length === 0) {
    return [new Paragraph({ 
      children: [new TextRun({ text: "-", font: "Arial", size: 20 })],
      spacing: { after: 100 }
    })];
  }
  
  const paragraphs: Paragraph[] = [];
  
  // Add "Direksi Pekerjaan:" label
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Direksi Pekerjaan: ", 
          bold: true, 
          font: "Arial", 
          size: 20,
          underline: {}
        }),
      ],
      spacing: { after: 50 },
    })
  );
  
  // List all directorProposals
  directorProposals.forEach((director: any, i: number) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: director.name || "-", 
            font: "Arial", 
            size: 20 
          }),
        ],
        spacing: { after: 50 },
      })
    );
  });
  
  // Add spacing
  paragraphs.push(new Paragraph({ children: [], spacing: { after: 100 } }));
  
  // Add "Direksi Lapangan:" label
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ 
          text: "Direksi Lapangan: ", 
          bold: true, 
          font: "Arial", 
          size: 20,
          underline: {}
        }),
      ],
      spacing: { after: 50 },
    })
  );
  
  // List all fieldDirectorProposals
  fieldDirectorProposals.forEach((director: any, i: number) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ 
            text: director.name || "-", 
            font: "Arial", 
            size: 20 
          }),
        ],
        spacing: { after: 50 },
      })
    );
  });
  
  return paragraphs;
})(),

// ✅ 12. PERSYARATAN CALON PENYEDIA
new Paragraph({
  children: [
    new TextRun({
      text: "12. PERSYARATAN CALON PENYEDIA",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.vendorRequirements),

// ✅ 13. USULAN METODE PENGADAAN
new Paragraph({
  children: [
    new TextRun({
      text: "13. USULAN METODE PENGADAAN",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.procurementMethod),

// ✅ 14. USULAN ATURAN PEMBAYARAN
new Paragraph({
  children: [
    new TextRun({
      text: "14. USULAN ATURAN PEMBAYARAN",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.paymentTerms),

// ✅ 15. USULAN ATURAN DENDA
new Paragraph({
  children: [
    new TextRun({
      text: "15. USULAN ATURAN DENDA",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.penaltyRules),

// ✅ 16. RENCANA ANGGARAN (MOVED FROM 11)
new Paragraph({
  children: [
    new TextRun({
      text: "16. RENCANA ANGGARAN",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),

// Budget Table
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
          children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 5, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 40, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Quantity", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Order Unit", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Unit price IDR", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "Total Price IDR", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })],
          width: { size: 20, type: WidthType.PERCENTAGE },
          shading: { fill: "D3D3D3", color: "auto" },
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
    // Total Row
    new TableRow({
      children: [
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: "Total", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
          columnSpan: 5,
        }),
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: tor.subtotal ? Number(tor.subtotal).toLocaleString("id-ID") : "0", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }),
    // PPN Row
    new TableRow({
      children: [
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: "PPN 11%", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
          columnSpan: 5,
        }),
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: tor.ppn ? Number(tor.ppn).toLocaleString("id-ID") : "0", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }),
    // Grand Total Row
    new TableRow({
      children: [
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: "Grand Total", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
          columnSpan: 5,
        }),
        new TableCell({ 
          children: [new Paragraph({ children: [new TextRun({ text: tor.grandTotal ? Number(tor.grandTotal).toLocaleString("id-ID") : "0", bold: true, font: "Arial", size: 20 })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }),
  ],
  borders: {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  },
}),

// Summary text
new Paragraph({
  children: [
    new TextRun({
      text: `Rencana anggaran sebesar Rp. ${tor.grandTotal ? Number(tor.grandTotal).toLocaleString("id-ID") : "0"},00 termasuk ppn 11%.`,
      font: "Arial",
      size: 20,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),

// ✅ 17. PERSYARATAN LAINNYA
new Paragraph({
  children: [
    new TextRun({
      text: "17. PERSYARATAN LAINNYA",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.otherRequirements),

// ✅ 18. RISK ASSESSMENT
new Paragraph({
  children: [
    new TextRun({
      text: "18. RISK ASSESSMENT",
      font: "Arial",
      size: 20,
      bold: true,
    }),
  ],
  spacing: { before: 200, after: 100 },
}),
...parseHtmlToParagraphs(tor.riskAssessment),



            // Parse directorProposals and fieldDirectorProposals
            ...(() => {
              const directorProposals = tor.directorProposals || [];
              const fieldDirectorProposals = tor.fieldDirectorProposals || [];
              
              // Validate array types
              if (!Array.isArray(directorProposals) || !Array.isArray(fieldDirectorProposals)) {
                return [new Paragraph({ 
                  children: [new TextRun({ text: "-", font: "Arial", size: 20 })],
                  spacing: { after: 100 }
                })];
              }
              
              // If both are empty
              if (directorProposals.length === 0 && fieldDirectorProposals.length === 0) {
                return [new Paragraph({ 
                  children: [new TextRun({ text: "-", font: "Arial", size: 20 })],
                  spacing: { after: 100 }
                })];
              }
              
              const paragraphs: Paragraph[] = [];
              
              // Combine both arrays
              const maxLength = Math.max(directorProposals.length, fieldDirectorProposals.length);
              
              for (let i = 0; i < maxLength; i++) {
                const directorWork = directorProposals[i]?.name || "-";
                const directorField = fieldDirectorProposals[i]?.name || "-";
              }
              
              return paragraphs;
            })(),
          ],
        },
        // === SECTION 2: LEMBAR PENGESAHAN (No Header) ===
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          headers: {
            default: new Header({
              children: [],
            }),
          },
          children: [
            ...generateLembarPengesahanTable(
              tor.approvalSignatures || [],
              tor.program || tor.title
            ),
          ],
        },
        // === SECTION 3: LAMPIRAN (With Header) ===
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
                                  transformation: { width: 136, height: 40 },
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
                                  transformation: { width: 29, height: 41 },
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
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      children: ["Halaman ", PageNumber.CURRENT],
                      font: "Arial",
                      size: 18,
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // LAMPIRAN Title
            new Paragraph({
              children: [
                new TextRun({
                  text: "LAMPIRAN",
                  font: "Arial",
                  size: 24,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 400 },
            }),

            // 1. Technical Particular & Guarantee (TPG)
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. Technical Particular & Guarantee (TPG)",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            ...((tor.technicalParticulars && Array.isArray(tor.technicalParticulars) && tor.technicalParticulars.length > 0)
              ? [generateTpgTable(tor.technicalParticulars)]
              : [new Paragraph({ text: "-", spacing: { after: 200 } })]),

            // 2. Inspection Testing Plan (ITP)
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. Inspection Testing Plan (ITP)",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 400, after: 100 },
            }),
            ...((tor.inspectionTestingPlans && Array.isArray(tor.inspectionTestingPlans) && tor.inspectionTestingPlans.length > 0)
              ? [generateItpTable(tor.inspectionTestingPlans)]
              : [new Paragraph({ text: "-", spacing: { after: 200 } })]),

            // 3. Document Request Sheet (DRS)
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. Document Request Sheet (DRS)",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 400, after: 100 },
            }),
            ...((tor.documentRequestSheets && Array.isArray(tor.documentRequestSheets) && tor.documentRequestSheets.length > 0)
              ? [generateDrsTable(tor.documentRequestSheets)]
              : [new Paragraph({ text: "-", spacing: { after: 200 } })]),

            // 4. Performance Guarantee Requirement Sheet (PGRS)
            new Paragraph({
              children: [
                new TextRun({
                  text: "4. Performance Guarantee Requirement Sheet (PGRS)",
                  font: "Arial",
                  size: 20,
                  bold: true,
                }),
              ],
              spacing: { before: 400, after: 100 },
            }),
            ...((tor.performanceGuarantees && Array.isArray(tor.performanceGuarantees) && tor.performanceGuarantees.length > 0)
              ? [generatePgrsTable(tor.performanceGuarantees)]
              : [new Paragraph({ text: "-", spacing: { after: 200 } })]),
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