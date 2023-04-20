
// Récupération des données depuis le localstorage
let projects = window.localStorage.getItem("http://localhost:5678/api/works");

//Récupération des données depuis l'API
if (projects === null) {
    const answerAPI = await fetch ("http://localhost:5678/api/works");
    projects = await answerAPI.json ();

    const projectsValue = JSON.stringify(projects);
    window.localStorage.setItem ("projects", projectsValue);
}else{
    projects = JSON.parse (projects);
}

//Affichage des projets sur le DOM
function createProject (projects) {
    for (let i in projects) {
    
        const contenerGallery = document.querySelector (".gallery");

        const figureElement = document.createElement ("figure");
        //On donne une id à chaque balise figure correspondant à la categoryId de chaque projet, permettant de trier les projets.
        figureElement.dataset.id = projects [i].categoryId;
 
        const imageProject = document.createElement ("img");
        imageProject.src = projects [i].imageUrl;

        const captionProject = document.createElement ("figcaption");
        captionProject.innerText = projects [i].title;

        contenerGallery.appendChild (figureElement);
        figureElement.appendChild (imageProject);
        figureElement.appendChild (captionProject);
    };
}


createProject (projects)

//Affichage des boutons filtres sur le DOM

const filters = ["Tous", "Objets", "Appartements", "Hôtels & restaurants"];

function createButtons () {
    const filtersValues = filters.values ();
    for (let i of filtersValues) {

    const contenerFilters = document.querySelector (".portfolio__filtres");

    const filtersElement = document.createElement ("button");
    filtersElement.textContent = i;

    contenerFilters.appendChild (filtersElement);

    //On donne une nom de class à chaque balise button ainsi créée pour faciliter le CSS et le tri.
    filtersElement.className = "filters__buttons";
    //On donne une id à chaque bouton équivalent à l'index de la valeur i (texte contenu) pour permettre de trier les projets.
    filtersElement.dataset.id = filters.indexOf (i);
    };
}

createButtons ()

/*Création du filtre par bouton:
* Le filtre compare l'id de la figure à l'id du bouton, et n'affiche que les résultats égaux.
* Aucune categoryId n'équivaut à 0, qui correspond au bouton "Tous". 
* Nous utiliserons cette conditions pour afficher tous les projets.
*/

const filterButton = document.querySelectorAll (".filters__buttons");

for (let i = 0; i < filterButton.length; i++) {

    filterButton [i].addEventListener ("click", function () {

        if (event.target.dataset.id == 0) {
            
            //On efface le contenu pour réafficher la totalité
            document.querySelector (".gallery").innerHTML="";
            createProject (projects);

        }else{

            const filteredproject = projects.filter (function (project) {
            return event.target.dataset.id == project.categoryId;
            });

            //On efface le contenu avant de le réafficher trié
            document.querySelector (".gallery").innerHTML="";
            createProject (filteredproject);
        };
    });
};