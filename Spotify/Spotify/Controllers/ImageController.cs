using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.Models;

namespace Spotify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ImageController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetAllImages()
        {
            var images = await _context.Images.ToListAsync();

            // Перевіряємо, що дані отримані коректно
            if (images == null || !images.Any())
            {
                return NotFound("No images found.");
            }

            // Формуємо відповідь з потрібними полями
            var result = images.Select(image => new
            {
                Id = image.Id,
                FileName = image.FileName,
                ContentType = image.ContentType,
                Data = image.Data != null ? Convert.ToBase64String(image.Data) : null
            });

            return Ok(result);
        }


        [HttpDelete("delete-multiple")]
        public async Task<IActionResult> DeleteMultipleImages([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("Немає зображень для видалення.");
            }

            // Отримуємо всі зображення, що відповідають наданим ідентифікаторам
            var imagesToDelete = await _context.Images.Where(image => ids.Contains(image.Id)).ToListAsync();

            if (imagesToDelete == null || !imagesToDelete.Any())
            {
                return NotFound("Зображення не знайдені.");
            }

            // Видаляємо зображення
            _context.Images.RemoveRange(imagesToDelete);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Зображення видалено успішно." });
        }


        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultipleImages(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("Файли не завантажені");

            var imageIds = new List<int>();

            foreach (var file in files)
            {
                var image = new ImageModel
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType
                };

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    image.Data = memoryStream.ToArray();
                }

                _context.Images.Add(image);
                await _context.SaveChangesAsync();

                imageIds.Add(image.Id); // Додаємо ID кожного зображення у список
            }

            return Ok(new { ImageIds = imageIds });
        }
        // Завантаження зображення
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var image = new ImageModel
            {
                FileName = file.FileName,
                ContentType = file.ContentType
            };

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                image.Data = stream.ToArray();
            }

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return Ok(new { ImageId = image.Id });
        }

        // Отримання зображення за ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context.Images.FindAsync(id);

            if (image == null)
                return NotFound();

            return File(image.Data, image.ContentType);
        }
    }

}
