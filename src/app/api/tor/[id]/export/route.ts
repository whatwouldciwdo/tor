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
  
  // Split by paragraphs and list items
  const blocks = html.split(/<\/p>|<\/li>|<br\s*\/?>/i);
  
  for (const block of blocks) {
    if (!block.trim()) continue;
    
    const runs: TextRun[] = [];
    let currentText = block;
    
    // Remove opening tags
    currentText = currentText.replace(/<p[^>]*>|<li[^>]*>/gi, '');
    
    // Parse formatting
    const parts = currentText.split(/(<\/?(strong|b|em|i)[^>]*>)/gi);
    let isBold = false;
    let isItalic = false;
    
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
          after: 200,
        },
      }));
    }
  }
  
  return paragraphs.length > 0 ? paragraphs : [new Paragraph({})];
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
      // @ts-ignore
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

    // Read Images (Fixed: logo-pln-horizontal.jpg for main logo)
    const plnLogoPath = path.join(process.cwd(), "public", "logo-pln-horizontal.jpg");
    const secondaryLogoPath = path.join(process.cwd(), "public", "image7.png");
    
    let plnLogoBuffer: Buffer | null = null;
    let secondaryLogoBuffer: Buffer | null = null;

    try {
      plnLogoBuffer = fs.readFileSync(plnLogoPath);
    } catch (e) {
      console.error("PLN Logo (logo-pln-horizontal.jpg) not found:", e);
    }

    try {
      secondaryLogoBuffer = fs.readFileSync(secondaryLogoPath);
    } catch (e) {
      console.error("Secondary Logo (image7.png) not found:", e);
    }

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
            titlePage: true, // Different first page headers/footers
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
                        // Center Text (Dynamic from tor.title)
                        new TableCell({
                          width: { size: 60, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Term of Reference (TOR) ${tor.title}`,
                                  font: "Arial",
                                  size: 16, // 8pt
                                  italics: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        // Right Logo (image7.png - secondary logo)
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
                  size: 28, // 14pt
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
                  size: 40, // 20pt
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),

            // Cover Image or placeholder
            ...(tor.coverImage ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: fs.readFileSync(path.join(process.cwd(), "public", tor.coverImage.startsWith('/') ? tor.coverImage.slice(1) : tor.coverImage)),
                    transformation: { width: 400, height: 300 },
                    type: "jpg",
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 800 },
              })
            ] : [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "* gambar hanya ilustrasi",
                    font: "Times New Roman",
                    size: 20,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 2000 },
              })
            ]),

            // Spacing to push footer down (approximate)
            new Paragraph({ spacing: { before: 2000 } }),

            // Bottom Footer Text
            new Paragraph({
              children: [
                new TextRun({
                  text: "PT PLN INDONESIA POWER",
                  font: "Times New Roman",
                  size: 24, // 12pt
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
                  size: 24, // 12pt
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
                  size: 24, // 12pt
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
                        // Left: Logo + Text below it
                        new TableCell({
                          width: { size: 80, type: WidthType.PERCENTAGE },
                          children: [
                            // PLN Logo
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
                            // Text below logo
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Term of Reference (TOR) ${tor.title}`,
                                  font: "Arial",
                                  size: 16, // 8pt
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
                  size: 20, // 10pt
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
                  size: 20, // 10pt
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
                  size: 20, // 10pt
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
                  size: 20, // 10pt
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
                  size: 20, // 10pt
                  bold: true,
                }),
              ],
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${tor.duration} ${tor.durationUnit === 'days' ? 'Hari Kalender' : tor.durationUnit === 'weeks' ? 'Minggu' : 'Bulan'}`,
                  font: "Arial",
                  size: 20, // 10pt
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
                  size: 20, // 10pt
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
                  size: 20, // 10pt
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

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="TOR-${tor.number || 'draft'}.docx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { message: "Failed to export ToR" },
      { status: 500 }
    );
  }
}
