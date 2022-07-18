
const images = [
    "index/images/hero1.png",
    "index/images/hero2.png",
    "index/images/hero3.png",
    "index/images/hero4.png"
]
let poz = 0

function switchImage() {
    document.getElementById("imageCycle").src = images[poz]


    if (poz > images.length - 2) { poz = 0 } else { poz++ }
}

switchImage()

/*
    https://www.scotch.vic.edu.au/my-scotch-students.aspx?
        __VIEWSTATE=/wEPDwUENTM4MWRk9os4XTxuP/PljKPqlL1zPvCwwUwgzrPRjxtMMp58fgk=
        &__VIEWSTATEGENERATOR=CA0B0334
        &ctl00$
            ctl00$
            ctl00$
            ContentPlaceHolderDefault$
            cp_content$
            WindowsLogin_3$
            EnteredUsername=scotchmel%5CMB6087
            &ctl00$
            ctl00$
            ctl00$
            ContentPlaceHolderDefault$
            cp_content$WindowsLogin_3$
            EnteredPassword=Betsie99!
*/

