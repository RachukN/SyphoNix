using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.AccountUser.Facebook
{
    public class FacebookLoginUser
    {
        public string AccessToken { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string About { get; set; }
        public string Image { get; set; }
    }
}
