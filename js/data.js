// Datos globales
let familyData = {};

// ============================================================
// FAMILIA BUENDÍA - "CIEN AÑOS DE SOLEDAD" - Gabriel García Márquez
// ============================================================
const SAMPLE_DATA = [
    // ===== GENERACIÓN 1 - FUNDADORES =====
    {
        id: 1,
        nombres_apellidos: "Don José Arcadio Buendía",
        fecha_nacimiento: "15/03/1800",
        fecha_fallecimiento: "25/04/1850",
        nacimiento_lugar: "Riohacha",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Fundador de Macondo. Apasionado por la alquimia y la ciencia. Murió atado a un castaño.",
        imagen: "",
        padres: "",
        hijos: "2;3",
        matrimonios: "4",
        hermanos: ""
    },
    {
        id: 4,
        nombres_apellidos: "Doña Úrsula Iguarán",
        fecha_nacimiento: "20/05/1805",
        fecha_fallecimiento: "15/12/1880",
        nacimiento_lugar: "Riohacha",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Matriarca de la familia. Vivió más de 100 años. Mantuvo la casa familiar en pie durante generaciones.",
        imagen: "",
        padres: "",
        hijos: "2;3",
        matrimonios: "1",
        hermanos: ""
    },

    // ===== GENERACIÓN 2 - HIJOS DE JOSÉ ARCADIO Y ÚRSULA =====
    {
        id: 2,
        nombres_apellidos: "José Arcadio Buendía Iguarán",
        fecha_nacimiento: "12/06/1825",
        fecha_fallecimiento: "10/09/1870",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "El primogénito. Se fue con los gitanos y regresó convertido en un hombre gigante. Murió de un disparo.",
        imagen: "",
        padres: "1;4",
        hijos: "5",
        matrimonios: "6",
        hermanos: "3"
    },
    {
        id: 3,
        nombres_apellidos: "Coronel Aureliano Buendía Iguarán",
        fecha_nacimiento: "20/08/1827",
        fecha_fallecimiento: "17/05/1890",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "El segundo hijo. Líder de la revolución liberal. Participó en 32 guerras civiles. Sobrevivió a 14 atentados.",
        imagen: "",
        padres: "1;4",
        hijos: "7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23",
        matrimonios: "24;25",
        hermanos: "2"
    },

    // ===== CÓNYUGES DE LA GENERACIÓN 2 =====
    {
        id: 6,
        nombres_apellidos: "Rebeca Buendía (de José Arcadio)",
        fecha_nacimiento: "15/10/1830",
        fecha_fallecimiento: "12/12/1895",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Huérfana adoptada por los Buendía. Se casó con José Arcadio. Murió en la casa familiar.",
        imagen: "",
        padres: "",
        hijos: "5",
        matrimonios: "2",
        hermanos: ""
    },
    {
        id: 24,
        nombres_apellidos: "Pilar Ternera (madre de los hijos del Coronel)",
        fecha_nacimiento: "10/02/1828",
        fecha_fallecimiento: "20/11/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Mujer de pueblo. Tuvo 17 hijos del Coronel Aureliano Buendía. Murió en su casa de Macondo.",
        imagen: "",
        padres: "",
        hijos: "7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23",
        matrimonios: "3",
        hermanos: ""
    },
    {
        id: 25,
        nombres_apellidos: "Remedios Moscote (esposa del Coronel)",
        fecha_nacimiento: "15/08/1840",
        fecha_fallecimiento: "10/03/1855",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "La pequeña esposa del Coronel. Murió joven durante el embarazo.",
        imagen: "",
        padres: "",
        hijos: "",
        matrimonios: "3",
        hermanos: ""
    },

    // ===== GENERACIÓN 3 - HIJOS DE JOSÉ ARCADIO =====
    {
        id: 5,
        nombres_apellidos: "Arcadio Buendía (hijo de José Arcadio y Rebeca)",
        fecha_nacimiento: "15/05/1850",
        fecha_fallecimiento: "20/08/1875",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hijo de José Arcadio y Rebeca. Gobernante tiránico de Macondo. Murió fusilado.",
        imagen: "",
        padres: "2;6",
        hijos: "26;27",
        matrimonios: "28",
        hermanos: ""
    },

    // ===== GENERACIÓN 3 - LOS 17 HIJOS DEL CORONEL =====
    // Todos hijos del Coronel Aureliano Buendía y Pilar Ternera
    {
        id: 7,
        nombres_apellidos: "Aureliano Buendía (hijo 1)",
        fecha_nacimiento: "15/01/1852",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel. Todos fueron bautizados con el nombre de Aureliano.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "8;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 8,
        nombres_apellidos: "Aureliano Buendía (hijo 2)",
        fecha_nacimiento: "20/02/1852",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;9;10;11;12;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 9,
        nombres_apellidos: "Aureliano Buendía (hijo 3)",
        fecha_nacimiento: "10/03/1852",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;10;11;12;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 10,
        nombres_apellidos: "Aureliano Buendía (hijo 4)",
        fecha_nacimiento: "25/03/1852",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;11;12;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 11,
        nombres_apellidos: "Aureliano Buendía (hijo 5)",
        fecha_nacimiento: "05/04/1853",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;12;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 12,
        nombres_apellidos: "Aureliano Buendía (hijo 6)",
        fecha_nacimiento: "15/04/1853",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;13;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 13,
        nombres_apellidos: "Aureliano Buendía (hijo 7)",
        fecha_nacimiento: "20/05/1853",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;14;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 14,
        nombres_apellidos: "Aureliano Buendía (hijo 8)",
        fecha_nacimiento: "10/06/1854",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;15;16;17;18;19;20;21;22;23"
    },
    {
        id: 15,
        nombres_apellidos: "Aureliano Buendía (hijo 9)",
        fecha_nacimiento: "25/06/1854",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;16;17;18;19;20;21;22;23"
    },
    {
        id: 16,
        nombres_apellidos: "Aureliano Buendía (hijo 10)",
        fecha_nacimiento: "05/07/1854",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;17;18;19;20;21;22;23"
    },
    {
        id: 17,
        nombres_apellidos: "Aureliano Buendía (hijo 11)",
        fecha_nacimiento: "15/08/1855",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;18;19;20;21;22;23"
    },
    {
        id: 18,
        nombres_apellidos: "Aureliano Buendía (hijo 12)",
        fecha_nacimiento: "20/08/1855",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;19;20;21;22;23"
    },
    {
        id: 19,
        nombres_apellidos: "Aureliano Buendía (hijo 13)",
        fecha_nacimiento: "10/09/1856",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;18;20;21;22;23"
    },
    {
        id: 20,
        nombres_apellidos: "Aureliano Buendía (hijo 14)",
        fecha_nacimiento: "25/09/1856",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;18;19;21;22;23"
    },
    {
        id: 21,
        nombres_apellidos: "Aureliano Buendía (hijo 15)",
        fecha_nacimiento: "05/10/1856",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;18;19;20;22;23"
    },
    {
        id: 22,
        nombres_apellidos: "Aureliano Buendía (hijo 16)",
        fecha_nacimiento: "15/10/1856",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Uno de los 17 hijos del Coronel.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;23"
    },
    {
        id: 23,
        nombres_apellidos: "Aureliano Buendía (hijo 17)",
        fecha_nacimiento: "20/10/1856",
        fecha_fallecimiento: "10/05/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "El último de los 17 hijos del Coronel. Todos fueron asesinados el mismo día.",
        imagen: "",
        padres: "3;24",
        hijos: "",
        matrimonios: "",
        hermanos: "7;8;9;10;11;12;13;14;15;16;17;18;19;20;21;22"
    },

    // ===== CÓNYUGES DE ARCADIO (GENERACIÓN 3) =====
    {
        id: 28,
        nombres_apellidos: "Sofía de la Piedad (esposa de Arcadio)",
        fecha_nacimiento: "15/02/1852",
        fecha_fallecimiento: "10/08/1900",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Esposa de Arcadio. Madre de los hijos de Arcadio.",
        imagen: "",
        padres: "",
        hijos: "26;27",
        matrimonios: "5",
        hermanos: ""
    },

    // ===== GENERACIÓN 4 - HIJOS DE ARCADIO =====
    {
        id: 26,
        nombres_apellidos: "José Arcadio Buendía (hijo de Arcadio)",
        fecha_nacimiento: "15/10/1870",
        fecha_fallecimiento: "20/12/1920",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hijo de Arcadio y Sofía. Heredó la fuerza descomunal de la familia.",
        imagen: "",
        padres: "5;28",
        hijos: "29;30",
        matrimonios: "31",
        hermanos: "27"
    },
    {
        id: 27,
        nombres_apellidos: "Remedios la Bella (hija de Arcadio)",
        fecha_nacimiento: "15/12/1872",
        fecha_fallecimiento: "15/08/1905",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "La mujer más hermosa de la tierra. Ascendió a los cielos mientras tendía la ropa.",
        imagen: "",
        padres: "5;28",
        hijos: "",
        matrimonios: "",
        hermanos: "26"
    },

    // ===== GENERACIÓN 4 - HIJOS DE JOSÉ ARCADIO (26) =====
    {
        id: 29,
        nombres_apellidos: "Aureliano Buendía (hijo de José Arcadio)",
        fecha_nacimiento: "15/05/1890",
        fecha_fallecimiento: "20/10/1920",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hijo de José Arcadio. Heredó la capacidad de ver el futuro.",
        imagen: "",
        padres: "26;31",
        hijos: "32;33",
        matrimonios: "34",
        hermanos: "30"
    },
    {
        id: 30,
        nombres_apellidos: "Santa Sofía de la Piedad (hija de José Arcadio)",
        fecha_nacimiento: "20/06/1892",
        fecha_fallecimiento: "10/12/1950",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hija de José Arcadio. Cuidó la casa durante muchos años.",
        imagen: "",
        padres: "26;31",
        hijos: "",
        matrimonios: "",
        hermanos: "29"
    },

    // ===== CÓNYUGES DE JOSÉ ARCADIO (26) =====
    {
        id: 31,
        nombres_apellidos: "Fernanda del Carpio (esposa de José Arcadio)",
        fecha_nacimiento: "10/08/1870",
        fecha_fallecimiento: "15/11/1940",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Esposa de José Arcadio. Madre de Aureliano y Santa Sofía.",
        imagen: "",
        padres: "",
        hijos: "29;30",
        matrimonios: "26",
        hermanos: ""
    },

    // ===== GENERACIÓN 5 - HIJOS DE AURELIANO (29) =====
    {
        id: 32,
        nombres_apellidos: "José Arcadio Buendía (hijo de Aureliano)",
        fecha_nacimiento: "10/10/1910",
        fecha_fallecimiento: "20/12/1960",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hijo de Aureliano. Viajó por el mundo y regresó a Macondo.",
        imagen: "",
        padres: "29;34",
        hijos: "35",
        matrimonios: "36",
        hermanos: "33"
    },
    {
        id: 33,
        nombres_apellidos: "Aureliano Buendía (hijo de Aureliano)",
        fecha_nacimiento: "15/12/1912",
        fecha_fallecimiento: "20/12/1960",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Hijo de Aureliano. El último de los Buendía.",
        imagen: "",
        padres: "29;34",
        hijos: "",
        matrimonios: "",
        hermanos: "32"
    },

    // ===== CÓNYUGES DE AURELIANO (29) =====
    {
        id: 34,
        nombres_apellidos: "Remedios (esposa de Aureliano)",
        fecha_nacimiento: "10/05/1890",
        fecha_fallecimiento: "15/08/1920",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Esposa de Aureliano. Madre de José Arcadio y Aureliano.",
        imagen: "",
        padres: "",
        hijos: "32;33",
        matrimonios: "29",
        hermanos: ""
    },

    // ===== GENERACIÓN 6 - HIJO DE JOSÉ ARCADIO (32) =====
    {
        id: 35,
        nombres_apellidos: "Aureliano Buendía (hijo de José Arcadio)",
        fecha_nacimiento: "15/05/1940",
        fecha_fallecimiento: "",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "",
        pais: "Colombia",
        comentarios: "El último miembro de la familia Buendía. Leyó los pergaminos de Melquiades.",
        imagen: "",
        padres: "32;36",
        hijos: "",
        matrimonios: "",
        hermanos: ""
    },

    // ===== CÓNYUGES DE JOSÉ ARCADIO (32) =====
    {
        id: 36,
        nombres_apellidos: "Amaranta Úrsula (esposa de José Arcadio)",
        fecha_nacimiento: "20/08/1920",
        fecha_fallecimiento: "15/12/1960",
        nacimiento_lugar: "Macondo",
        fallecimiento_lugar: "Macondo",
        pais: "Colombia",
        comentarios: "Esposa de José Arcadio. Madre de Aureliano.",
        imagen: "",
        padres: "",
        hijos: "35",
        matrimonios: "32",
        hermanos: ""
    }
];

function loadSampleData() {
    SAMPLE_DATA.forEach(p => { familyData[p.id] = p; });
    console.log('📚 Datos de la familia Buendía cargados correctamente');
}

function getNextId() {
    const ids = Object.keys(familyData).map(Number);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}
