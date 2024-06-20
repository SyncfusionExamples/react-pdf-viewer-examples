using db_formfilling.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace db_formfilling.Pages
{
	public class IndexModel : PageModel
	{
		private readonly ILogger<IndexModel> _logger;
		private readonly ApplicationDbContext _context;
		public IndexModel(ILogger<IndexModel> logger, ApplicationDbContext context)
		{
			_logger = logger;
			_context = context;
		}
		
		public IActionResult OnPostUsers(User user)
		{
			var list=  _context.Users.ToList() as List<User>;
            return Content(list.ToString());

        }
		public void OnGet()
		{

		}
	}
}
