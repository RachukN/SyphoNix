using Microsoft.AspNetCore.Mvc;
using Spotify.Data;
using Spotify.Models;

using Microsoft.EntityFrameworkCore;
[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly ImgServerDbContext _context;

    public ImagesController(ImgServerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ImageModel>>> GetImages()
    {
        return await _context.Images.ToListAsync();
    }

    // Додати зображення
    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> UploadImages([FromForm] IFormFile[] imageFiles, [FromForm] string category)
    {
        if (imageFiles == null || imageFiles.Length == 0)
        {
            return BadRequest("No files uploaded.");
        }

        var images = new List<ImageModel>();

        foreach (var imageFile in imageFiles)
        {
            if (imageFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await imageFile.CopyToAsync(ms);
                    byte[] fileBytes = ms.ToArray();

                    var imageModel = new ImageModel
                    {
                        ImageName = imageFile.FileName,
                        ImageData = fileBytes,
                        ImageUrl = "N/A", // або реальний URL, якщо потрібно
                        Category = category, // Присвоюємо категорію
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    images.Add(imageModel);
                }
            }
        }

        _context.Images.AddRange(images);
        await _context.SaveChangesAsync();

        return Ok(new { Count = images.Count });
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetImage(int id)
    {
        var image = await _context.Images.FindAsync(id);
        if (image == null)
        {
            return NotFound();
        }

        // Повертаємо файл як результат з правильним MIME-типом
        return File(image.ImageData, "image/png"); // Змініть MIME-тип залежно від типу зображення
    }

    [HttpGet]
    [Route("api/images")]
    public async Task<IActionResult> GetAllImages()
    {
        var images = await _context.Images.Select(i => new {
            i.Id,
            i.ImageName,
            i.Category
        }).ToListAsync();

        return Ok(images);
    }
}
