using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Syncfusion.EJ2.PdfViewer;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Pdf.Parsing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Syncfusion.Pdf.Interactive;
using System.Net;
using System.Data.SqlClient;
using Syncfusion.Drawing;
using System.Text.Json;
using Unity.Policy;
using System.Drawing;
using Syncfusion.Pdf.Redaction;
using Syncfusion.Pdf.Exporting;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.IO.Pipes;
using Syncfusion.EJ2.Spreadsheet;
using Syncfusion.Pdf.Graphics;
using SkiaSharp;
using System.Drawing.Imaging;
using System.Xml.Linq;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using System.Reflection;
using ControllerPractice;
using System.Runtime.InteropServices;
using System.Collections;
using System.Text;
using Azure;
using System.Linq;
using Syncfusion.Pdf.Security;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Syncfusion.EJ2;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Cors;
using System.Security.Cryptography.X509Certificates;
using Microsoft.Extensions.Configuration;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;

namespace PdfViewerService2.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PdfViewerController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        //Initialize the memory cache object   
        public IMemoryCache _cache;
        public PdfViewerController(IHostingEnvironment hostingEnvironment, IMemoryCache cache)
        {
            _hostingEnvironment = hostingEnvironment;
            _cache = cache;
            Console.WriteLine("PdfViewerController initialized");
        }

        [HttpPost("Load")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/Load")]
        //Post action for loading the PDF documents 
        public IActionResult Load([FromBody] Dictionary<string, string> jsonObject)
        {
            Console.WriteLine("Load called");
            //Initialize the PDF viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            MemoryStream stream = new MemoryStream();

            object jsonResult = new object();

            if (jsonObject != null && jsonObject.ContainsKey("document"))
            {
                if (bool.Parse(jsonObject["isFileName"]))
                {
                    string documentPath = GetDocumentPath(jsonObject["document"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        stream = new MemoryStream(bytes);
                    }
                    else
                    {
                        string fileName = jsonObject["document"].Split(new string[] { "://" }, StringSplitOptions.None)[0];
                        if (fileName == "http" || fileName == "https")
                        {
                            WebClient WebClient = new WebClient();
                            byte[] pdfDoc = WebClient.DownloadData(jsonObject["document"]);
                            stream = new MemoryStream(pdfDoc);
                        }
                        else
                        {
                            return this.Content(jsonObject["document"] + " is not found");
                        }

                    }
                }
                else
                {
                    byte[] bytes = Convert.FromBase64String(jsonObject["document"]);
                    stream = new MemoryStream(bytes);
                }
            }
            jsonResult = pdfviewer.Load(stream, jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("Bookmarks")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/Bookmarks")]
        //Post action for processing the bookmarks from the PDF documents
        public IActionResult Bookmarks([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            var jsonResult = pdfviewer.GetBookmarks(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("RenderPdfPages")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/RenderPdfPages")]
        //Post action for processing the PDF documents  
        public IActionResult RenderPdfPages([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object jsonResult = pdfviewer.GetPage(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("RenderPdfTexts")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/RenderPdfTexts")]
        //Post action for processing the PDF texts  
        public IActionResult RenderPdfTexts([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object jsonResult = pdfviewer.GetDocumentText(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("RenderThumbnailImages")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/RenderThumbnailImages")]
        //Post action for rendering the thumbnail images
        public IActionResult RenderThumbnailImages([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object result = pdfviewer.GetThumbnailImages(jsonObject);
            return Content(JsonConvert.SerializeObject(result));
        }

        [AcceptVerbs("Post")]
        [HttpPost("RenderTaggedContent")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/RenderTaggedContent")]
        //Post action for processing the PDF texts  
        public IActionResult RenderTaggedContent([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object jsonResult = pdfviewer.GetTaggedElements(jsonObject);
            System.Diagnostics.Debug.WriteLine(JsonConvert.SerializeObject(jsonResult));
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("RenderAnnotationComments")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/RenderAnnotationComments")]
        //Post action for rendering the annotations
        public IActionResult RenderAnnotationComments([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object jsonResult = pdfviewer.GetAnnotationComments(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("ExportAnnotations")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/ExportAnnotations")]
        //Post action to export annotations
        public IActionResult ExportAnnotations([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string jsonResult = pdfviewer.ExportAnnotation(jsonObject);
            return Content(jsonResult);
        }

        [AcceptVerbs("Post")]
        [HttpPost("ImportAnnotations")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/ImportAnnotations")]
        //Post action to import annotations
        public IActionResult ImportAnnotations([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string jsonResult = string.Empty;
            object JsonResult;
            if (jsonObject != null && jsonObject.ContainsKey("fileName"))
            {
                string documentPath = GetDocumentPath(jsonObject["fileName"]);
                if (!string.IsNullOrEmpty(documentPath))
                {
                    jsonResult = System.IO.File.ReadAllText(documentPath);
                    string[] searchStrings = { "textMarkupAnnotation", "measureShapeAnnotation", "freeTextAnnotation", "stampAnnotations", "signatureInkAnnotation", "stickyNotesAnnotation", "signatureAnnotation", "AnnotationType" };
                    bool isnewJsonFile = !searchStrings.Any(jsonResult.Contains);
                    if (isnewJsonFile)
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        jsonObject["importedData"] = Convert.ToBase64String(bytes);
                        JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                        jsonResult = JsonConvert.SerializeObject(JsonResult);
                    }
                }
                else
                {
                    return this.Content(jsonObject["document"] + " is not found");
                }
            }
            else
            {
                string extension = System.IO.Path.GetExtension(jsonObject["importedData"]);
                if (extension != ".xfdf")
                {
                    JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                    return Content(JsonConvert.SerializeObject(JsonResult));
                }
                else
                {
                    string documentPath = GetDocumentPath(jsonObject["importedData"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        jsonObject["importedData"] = Convert.ToBase64String(bytes);
                        JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                        return Content(JsonConvert.SerializeObject(JsonResult));
                    }
                    else
                    {
                        return this.Content(jsonObject["document"] + " is not found");
                    }
                }
            }
            return Content(jsonResult);
        }

        [AcceptVerbs("Post")]
        [HttpPost("ExportFormFields")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/ExportFormFields")]
        //Post action to export form fields
        public IActionResult ExportFormFields([FromBody] Dictionary<string, string> jsonObject)

        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string jsonResult = pdfviewer.ExportFormFields(jsonObject);
            string base64String = jsonResult.Split(new string[] { "data:application/json;base64," }, StringSplitOptions.None)[1];
            if (!string.IsNullOrEmpty(base64String))
            {
                byte[] byteArray = Convert.FromBase64String(base64String);
                System.IO.File.WriteAllBytes("FormDesigner.xfdf", byteArray);
            }
            return Content(jsonResult);
        }

        [AcceptVerbs("Post")]
        [HttpPost("ImportFormFields")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/ImportFormFields")]
        //Post action to import form fields
        public IActionResult ImportFormFields([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            if (jsonObject["formFieldDataFormat"] == "Json")
            {
                try
                {
                    jsonObject["data"] = JsonConvert.DeserializeObject(jsonObject["data"]).ToString();
                }
                catch (Exception e)
                {
                    jsonObject["data"] = jsonObject["data"];
                    jsonObject["data"] = GetDocumentPath(jsonObject["data"]);
                }

            }
            object jsonResult = pdfviewer.ImportFormFields(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost("Unload")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/Unload")]
        //Post action for unloading and disposing the PDF document resources  
        public IActionResult Unload([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            pdfviewer.ClearCache(jsonObject);
            return this.Content("Document cache is cleared");
        }


        [HttpPost("Download")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/Download")]
        //Post action for downloading the PDF documents
        public IActionResult Download([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            return Content(documentBase);
        }

        [HttpPost("PrintImages")]
        //[Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]
        [Route("[controller]/PrintImages")]
        //Post action for printing the PDF documents
        public IActionResult PrintImages([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object pageImage = pdfviewer.GetPrintImage(jsonObject);
            return Content(JsonConvert.SerializeObject(pageImage));
        }

        //Returns the PDF document path
        private string GetDocumentPath(string document)
        {
            string documentPath = string.Empty;
            if (!System.IO.File.Exists(document))
            {
                var path = _hostingEnvironment.ContentRootPath;
                if (System.IO.File.Exists(path + "/Data/" + document))
                    documentPath = path + "/Data/" + document;
            }
            else
            {
                documentPath = document;
            }
            Console.WriteLine(documentPath);
            return documentPath;
        }

        //GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [AcceptVerbs("Get")]
        [HttpGet("GetCustomStamp")]
        [Route("[controller]/GetCustomStamp")]
        public string GetCustomStamp()
        {
            byte[] imageArray = System.IO.File.ReadAllBytes(@"square image.png");
            string base64 = Convert.ToBase64String(imageArray);
            return "data:image/png;base64," + base64;
        }

        [AcceptVerbs("Get")]
        [HttpGet("Validate")]
        [Route("[controller]/Validate")]
        public IActionResult Validate()
        {
            // Get the document from the given path
            var documentPath = _hostingEnvironment.ContentRootPath + "/Data/" + "formdesignerrequired.pdf";
            byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
            MemoryStream stream = new MemoryStream(bytes);

            // Initialize the loaded document and load the document from the stream 
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(stream);

            // Get the XFDF file from the given path
            FileStream xfdfStream = new FileStream(_hostingEnvironment.ContentRootPath + "/FormDesigner.xfdf", FileMode.Open, FileAccess.Read);

            // Import data from the XFDF stream
            loadedDocument.Form.ImportDataXFDF(xfdfStream);

            // Get the form fields collection from the loaded document
            PdfLoadedFormFieldCollection collection = loadedDocument.Form.Fields;

            // Get the non-filled required fields from the form fields collection
            List<string> nonFilledRequireField = new List<string>();
            if(collection != null)
            {
                foreach(var item in collection)
                {
                    var fieldName = getNonFilledRequireField(item);
                    if(fieldName != "")
                    {
                        nonFilledRequireField.Add(fieldName);
                    }
                }
            }
            return Content(JsonConvert.SerializeObject(nonFilledRequireField));
        }

        // Returns the non-field form field names that are marked as required
        private string getNonFilledRequireField(Object item)
        {
            string nonFilledField = "";

            PdfLoadedTextBoxField loadedTextBoxField = item as PdfLoadedTextBoxField;
            if (loadedTextBoxField != null)
            {
                if (loadedTextBoxField.Required)
                {
                    if (loadedTextBoxField.Text == null || loadedTextBoxField.Text == "")
                    {
                        nonFilledField = loadedTextBoxField.Name;
                    }
                }
            }

            PdfLoadedCheckBoxField checkBoxField = item as PdfLoadedCheckBoxField;
            if (checkBoxField != null)
            {
                if (checkBoxField.Required)
                {
                    if (checkBoxField.Checked == null || !checkBoxField.Checked)
                    {
                        nonFilledField = checkBoxField.Name;
                    }
                }
            }

            PdfLoadedRadioButtonListField loadedRadioButtonField = item as PdfLoadedRadioButtonListField;
            if(loadedRadioButtonField != null)
            {
                if (loadedRadioButtonField.Required)
                {
                    if (loadedRadioButtonField.SelectedIndex !=null && loadedRadioButtonField.SelectedIndex == -1)
                    {
                        nonFilledField = loadedRadioButtonField.Name;
                    }
                }
            }

            PdfLoadedListBoxField listBoxField = item as PdfLoadedListBoxField;
            if (listBoxField != null)
            {
                if (listBoxField.Required)
                {
                    if (listBoxField.SelectedIndex != null && !(listBoxField.SelectedItem.Count > 0))
                    {
                        nonFilledField = listBoxField.Name;
                    }
                }
            }

            PdfLoadedComboBoxField comboBoxField = item as PdfLoadedComboBoxField;
            if (comboBoxField != null)
            {
                if (comboBoxField.Required)
                {
                    if (comboBoxField.SelectedIndex != null && !(comboBoxField.SelectedItem.Count > 0))
                    {
                        nonFilledField = comboBoxField.Name;
                    }
                }
            }
            return nonFilledField;
        }

        [AcceptVerbs("Get")]
        [HttpGet("GetCustomStampWithName")]
        [Route("[controller]/GetCustomStampWithName")]
        public string GetCustomStampWithName(string name)
        {
            byte[] imageArray = System.IO.File.ReadAllBytes(name + ".png");
            string base64 = Convert.ToBase64String(imageArray);
            return "data:image/png;base64," + base64;
        }

        [HttpGet("PDFData")]
        //[Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]
        [Route("[controller]/PDFData")]
        public ActionResult PDFData()
        {
            //Creating new PDF document instance
            PdfDocument document = new PdfDocument();
            //Setting margin
            document.PageSettings.Margins.All = 0;
            //Adding a new page
            PdfPage page = document.Pages.Add();
            //Saving the PDF to the MemoryStream
            MemoryStream ms = new MemoryStream();
            document.Save(ms);
            //If the position is not set to '0' then the PDF will be empty.
            ms.Position = 0;

            //Download the PDF document in the browser.
            FileStreamResult fileStreamResult = new FileStreamResult(ms, "application/pdf");
            fileStreamResult.FileDownloadName = "Sample.pdf";
            return fileStreamResult;
        }

        public string FlattenAnnotations(Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            string convertedBase = documentBase.Substring(documentBase.LastIndexOf(',') + 1);
            byte[] bytes = Convert.FromBase64String(convertedBase);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(bytes);
            loadedDocument.FlattenAnnotations(false);

            //Save the document into stream
            MemoryStream stream = new MemoryStream();
            loadedDocument.Save(stream);
            stream.Position = 0;
            //Close the document
            loadedDocument.Close(true);
            string updatedDocumentBase = Convert.ToBase64String(stream.ToArray());
            return ("data:application/pdf;base64," + updatedDocumentBase);
        }

        [HttpPost("AddAnnotation")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/AddAnnotation")]
        //Post action for downloading the PDF documents
        public IActionResult AddAnnotation([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            string convertedBase = documentBase.Substring(documentBase.LastIndexOf(',') + 1);
            byte[] bytes = Convert.FromBase64String(convertedBase);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(bytes);
            int pageNumber = int.Parse(jsonObject["currentpagenumber"].ToString()) - 1;
            int destinationPageNumber = int.Parse(jsonObject["pagenumber"].ToString()) - 1;
            var x = float.Parse(jsonObject["xposition"].ToString());
            var y = float.Parse(jsonObject["yposition"].ToString());
            var height = float.Parse(jsonObject["height"].ToString());
            var width = float.Parse(jsonObject["width"].ToString());

            Syncfusion.Drawing.RectangleF docLinkAnnotationBounds = new Syncfusion.Drawing.RectangleF(x, y, width, height);


            var destination = new PdfDestination(loadedDocument.Pages[destinationPageNumber]);
            //Create a new document link annotation.
            PdfDocumentLinkAnnotation documentLinkAnnotation = new PdfDocumentLinkAnnotation
                (docLinkAnnotationBounds);
            //Set the annotation flags.
            documentLinkAnnotation.AnnotationFlags = PdfAnnotationFlags.NoRotate;
            //Set the annotation text.
            documentLinkAnnotation.Text = jsonObject["linkName"].ToString();
            //Set the annotation's color.
            documentLinkAnnotation.Color = new PdfColor(Syncfusion.Drawing.Color.Red);
            documentLinkAnnotation.Color = Syncfusion.Drawing.Color.Blue;
            documentLinkAnnotation.Destination = destination;
            documentLinkAnnotation.Destination.Zoom = 5;
            documentLinkAnnotation.Destination.Location = new Syncfusion.Drawing.Point(10, 0);
            documentLinkAnnotation.SetAppearance(true);
            loadedDocument.Pages[pageNumber].Annotations.Add(documentLinkAnnotation);

            //Save the document into stream
            MemoryStream stream = new MemoryStream();
            loadedDocument.Save(stream);
            stream.Position = 0;
            //Close the document
            loadedDocument.Close(true);
            string updatedDocumentBase = Convert.ToBase64String(stream.ToArray());
            return Content("data:application/pdf;base64," + updatedDocumentBase);
        }

        [HttpPost("AddSignature")]
		[Route("[controller]/AddSignature")]
		public IActionResult AddSignature([FromBody] Dictionary<string, string> jsonObject)
		{
			PdfRenderer pdfviewer = new PdfRenderer(_cache);
			string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
			byte[] documentBytes = Convert.FromBase64String(documentBase.Split(",")[1]);
			PdfLoadedDocument loadedDocument = new PdfLoadedDocument(documentBytes);
			//Get the first page of the document.
			PdfPageBase loadedPage = loadedDocument.Pages[0];
			//Create new X509Certificate2 with the root certificate.
			X509Certificate2 certificate = new X509Certificate2(GetDocumentPath("PDF.pfx"), "syncfusion");
			PdfCertificate pdfCertificate = new PdfCertificate(certificate);
			//Creates a digital signature.
			PdfSignature signature = new PdfSignature(loadedDocument, loadedPage, pdfCertificate, "Signature");
			signature.Certificated = true;
			MemoryStream str = new MemoryStream();
			//Saves the document.
			loadedDocument.Save(str);
			byte[] docBytes = str.ToArray();
			string docBase64 = "data:application/pdf;base64," + Convert.ToBase64String(docBytes);
			return Content(docBase64);
		}

		[HttpPost("ValidateSignature")]
		//[EnableCors("AllowAllOrigins")]
		[Route("[controller]/ValidateSignature")]
		public IActionResult ValidateSignature([FromBody] Dictionary<string, string> jsonObject)
		{
			var hasDigitalSignature = false;
			var errorVisible = false;
			var successVisible = false;
			var warningVisible = false;
			var downloadVisibility = true;
			var message = string.Empty;
			if (jsonObject.ContainsKey("documentData"))
			{
				byte[] documentBytes = Convert.FromBase64String(jsonObject["documentData"].Split(",")[1]);
				PdfLoadedDocument loadedDocument = new PdfLoadedDocument(documentBytes);

				PdfLoadedForm form = loadedDocument.Form;
				if (form != null)
				{
					foreach (PdfLoadedField field in form.Fields)
					{
						if (field is PdfLoadedSignatureField)
						{
							//Gets the first signature field of the PDF document.
							PdfLoadedSignatureField signatureField = field as PdfLoadedSignatureField;
							if (signatureField.IsSigned)
							{
								hasDigitalSignature = true;
								//X509Certificate2Collection to check the signers identity using root certificates.
								X509Certificate2Collection collection = new X509Certificate2Collection();
								//Create new X509Certificate2 with the root certificate.
								X509Certificate2 certificate = new X509Certificate2(GetDocumentPath("PDF.pfx"), "syncfusion");
								//Add the certificate to the collection.
								collection.Add(certificate);
								//Validate all signatures in loaded PDF document and get the list of validation result.
								PdfSignatureValidationResult result = signatureField.ValidateSignature(collection);
								//Checks whether the document is modified or not.
								if (result.IsDocumentModified)
								{
									errorVisible = true;
									successVisible = false;
									warningVisible = false;
									downloadVisibility = false;
									message = "The document has been digitally signed, but it has been modified since it was signed and at least one signature is invalid .";
								}
								else
								{
									//Checks whether the signature is valid or not.
									if (result.IsSignatureValid)
									{
										if (result.SignatureStatus.ToString() == "Unknown")
										{
											errorVisible = false;
											successVisible = false;
											warningVisible = true;
											message = "The document has been digitally signed and at least one signature has problem";
										}
										else
										{
											errorVisible = false;
											successVisible = true;
											warningVisible = false;
											downloadVisibility = false;
											message = "The document has been digitally signed and all the signatures are valid.";
										}
									}
								}
							}
						}
					}
				}
			}
			return Content(JsonConvert.SerializeObject(new { hasDigitalSignature = hasDigitalSignature, errorVisible = errorVisible, successVisible = successVisible, warningVisible = warningVisible, downloadVisibility = downloadVisibility, message = message }));

		}

	}
}

