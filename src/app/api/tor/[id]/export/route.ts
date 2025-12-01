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

// Enhanced HTML to Paragraphs parser
function parseHtmlToParagraphs(html: string | null): Paragraph[] {
  if (!html) return [new Paragraph({})];

  const paragraphs: Paragraph[] = [];
  
  // Split by paragraphs and list items, keeping the tags for context
  // We use a simpler split first
  const blocks = html.split(/<\/p>|<\/li>|<br\s*\/?>/i);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    const runs: TextRun[] = [];
    let currentText = block;
    
    // Check if it's a list item
    const isListItem = /<li[^>]*>/i.test(currentText);
    
    // Remove opening tags
    currentText = currentText.replace(/<p[^>]*>|<li[^>]*>|<ol[^>]*>|<ul[^>]*>/gi, '');
    
    // Parse formatting
    const parts = currentText.split(/(<\/?(strong|b|em|i)[^>]*>)/gi);
    let isBold = false;
    let isItalic = false;
    
    // Add bullet/number for list items (simplified)
    if (isListItem) {
      runs.push(new TextRun({
        text: "• ", // Generic bullet for now, hard to track numbers without full parser
        font: "Arial",
        size: 20,
      }));
    }
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (/<(strong|b)[^>]*>/i.test(part)) {
        isBold = true;
      } else if (/<\/(strong|b)>/i.test(part)) {
        isBold = false;
      } else if (/<(em|i)[^>]*>/i.test(part)) {
        isItalic = true;
      } else if (/<\/(em|i)>/i.test(part)) {
        isItalic = false;
      } else if (part && !/^</.test(part)) {
        // Remove any remaining HTML tags
        const cleanText = part.replace(/<[^>]+>/g, '').trim();
        if (cleanText) {
          runs.push(new TextRun({
            text: cleanText,
            font: "Arial",
            size: 20, // 10pt
            bold: isBold,
            italics: isItalic,
          }));
        }
      }
    }
    
    if (runs.length > 0) {
      paragraphs.push(new Paragraph({
        children: runs,
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          line: 360, // 1.5 spacing
          after: isListItem ? 0 : 200, // No space after list items for compact look
        },
        indent: isListItem ? { left: 720, hanging: 360 } : undefined, // Indent for list items
      }));
    }
  }
  
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
    console.log("   - Cover Image Path:", tor.coverImage || "(none)");

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

            // Cover Image (Fixed!)
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