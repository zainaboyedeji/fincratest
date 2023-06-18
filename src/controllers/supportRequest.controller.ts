import { Request, Response } from "express";
import _ from "lodash";
import SupportRequestService from "../services/supportRequest.service";
import { ISupportRequest } from "../models/SupportRequest";
import { NotFoundError } from "../errors/NotFoundError";
import { AlreadyExistError } from "../errors/AlreadyExistError";
import { AuthRequest } from "../types/request";
import json2csv from "json2csv";
import pdf from "html-pdf";
import { IUser } from "../models/User";

class SupportRequestController {
  constructor(public supportRequestService: SupportRequestService) {}

  public createSupportRequest = async (req: AuthRequest, res: Response) => {
    try {
      const payload = _.pick(req.body, ["title", "description"]) as any;

      payload.createdBy = req.user?._id;

      const supportRequest = await this.supportRequestService.createSupportRequest(payload);

      return res.status(201).json({ data: supportRequest });
    } catch (err) {
      if (err instanceof AlreadyExistError) {
        return res.status(404).json({ error: err.message });
      }

      return res
        .status(500)
        .json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };

  public listSupportRequests = async (req: Request, res: Response) => {
    try {
      const items = await this.supportRequestService.listSupportRequests();

      return res.status(201).json({ data: items });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };

  public updateSupportRequest = async (req: AuthRequest, res: Response) => {
    try {
      const payload = _.pick(req.body, ["status", "assignee"]) as any;

      const supportRequest = await this.supportRequestService.updateSupportRequest(
        req.params.id,
        payload
      );

      return res.status(201).json({ data: supportRequest });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
      }

      return res
        .status(500)
        .json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };

  public exportSupportRequest = async (req: Request, res: Response) => {
    try {
      const format = req.params.format;

      const items = await this.supportRequestService.listSupportRequests({ status: "escalated" });

      if (format === "csv") {
        const values = items.map((item) => {
          return {
            title: item.title,
            description: item.description,
            status: item.status,
            createdBy: (item.createdBy as IUser).name,
            assignee: (item.assignee as IUser).name,
          };
        });
        
        const csvData = json2csv.parse(values);

        // Set response headers for CSV
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=data.csv");

        // Send the CSV data as response
        res.send(csvData);
      } else if (format === "pdf") {
        // Generate HTML content for PDF
        const htmlContent = `
          <html>
            <body>
              <h1>Data</h1>
              <table>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Created By</th>
                  <th>Assigned To</th>
                </tr>
                ${items
                  .map(
                    (record) => `<tr>
                    <td>${record.title}</td>
                    <td>${record.description}</td>
                    <td>${record.status}</td>
                    <td>${(record.createdBy as IUser)?.name}</td>
                    <td>${(record.assignee as IUser)?.name}</td>
                  </tr>`
                  )
                  .join("")}
              </table>
            </body>
          </html>
        `;

        // Set PDF options
        const pdfOptions = { format: "Letter" } as const;

        // Generate PDF from HTML
        pdf.create(htmlContent, pdfOptions).toStream((err, stream) => {
          if (err) {
            res.status(500).send("Error generating PDF");
          } else {
            // Set response headers for PDF
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=data.pdf");

            // Pipe the PDF stream to the response
            stream.pipe(res);
          }
        });
      } else {
        return res.status(201).json({ data: items });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Something went wrong, please contact support if issue persists!" });
    }
  };
}

export default SupportRequestController;
