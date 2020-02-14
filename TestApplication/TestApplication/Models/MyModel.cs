using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TestApplication.Models
{
    public class Date
    {
        [Required(ErrorMessage ="Name este necesar")]
        public string Nume { get; set; }
        [Required(ErrorMessage ="Prenumele este necesar")]
        public string Prenume { get; set; }
        [Required(ErrorMessage ="Este necesar")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress]
        public string Email { get; set; }
    }
    public class Zbor
    {
        [Required]
        public string Locatie { get; set; }
        List<Puncte> ListaPuncte { get; set; }

       public Zbor() {
            ListaPuncte = new List<Puncte>();
        }

    }
    public class Puncte
    {
        public string Latitudine { get; set; }
        public string Longitudine { get; set; }
    }

    public class Aggregate
    {
        public  Date DateSolicitant { get; set; }
        public List<Zbor> ListaZbor { get; set; } 

       public Aggregate()
        {
            ListaZbor = new List<Zbor>();
        }
    }
}