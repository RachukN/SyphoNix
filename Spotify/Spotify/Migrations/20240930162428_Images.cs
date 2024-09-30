using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Spotify.Migrations
{
    /// <inheritdoc />
    public partial class Images : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // No need to rename 'FileName' or 'ContentType' since they don't exist
            // migrationBuilder.RenameColumn(
            //     name: "FileName",
            //     table: "Images",
            //     newName: "ImagePath");

            // migrationBuilder.RenameColumn(
            //     name: "ContentType",
            //     table: "Images",
            //     newName: "Category");

            // Your migration logic can be placed here if needed
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert back if necessary, but these columns no longer exist.
            // migrationBuilder.RenameColumn(
            //     name: "ImagePath",
            //     table: "Images",
            //     newName: "FileName");

            // migrationBuilder.RenameColumn(
            //     name: "Category",
            //     table: "Images",
            //     newName: "ContentType");

            // Add back 'Data' column if rolling back is necessary.
            migrationBuilder.AddColumn<byte[]>(
                name: "Data",
                table: "Images",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
