using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Syncfusion.EJ2.PdfViewer;
using Syncfusion.Pdf.Parsing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Pdf.Security;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Interactive;

namespace PdfViewerService2.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PdfViewerController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        //Initialize the memory cache object   
        public IMemoryCache _cache;
        private IConfiguration _configuration;
        private readonly ILogger<PdfViewerController> _logger;

        public PdfViewerController(IHostingEnvironment hostingEnvironment, IMemoryCache cache, IConfiguration configuration, ILogger<PdfViewerController> logger)
        {
            _hostingEnvironment = hostingEnvironment;
            _cache = cache;
            _logger = logger;
        }

        [AcceptVerbs("Post")]
        [HttpPost("CheckDownload")]
        /*        [Microsoft.AspNetCore.Cors.EnableCors("MyPolicy")]*/
        [Route("[controller]/CheckDownload")]
        //Post action for processing the PDF documents  
        public IActionResult CheckDownload([FromBody] Dictionary<string, string> jsonObject)
        {
            var canDownload = jsonObject["canDownload"];
            return Content(canDownload);
        }
    }
}