
// Récupération des données des projets depuis le localstorage
let projects = window.localStorage.getItem("http://localhost:5678/api/works");

//Au besoin récupération des données des projets depuis l'API
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
        figureElement.dataset.id = projects [i].category.id;
 
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



/* Création d'un affichage dynamique des boutons :
*
* L'intérêt est de créer un affichage dynamique des boutons filtres en fonction des noms catégories des projets, 
* avec une fonction filtre se mettant à jour automatiquement, 
* selon le nombre de catégorie créé lors de la sauvegarde d'un nouveau projet dans d'API.
*/

/* Récupération des données des catégories depuis le localstorage. 
* FACULTATIF INFOS NECESSAIRES DEJA PRESENTENT DANS PROJECTS.
* Est-ce plus intéressant en termes de perfomances de ne télécharger qu'une seule fois des données,
* et d'avoir un code plus complexe pour les traiter,
* ou de télécharger plusieurs fois des données et d'avoir un code plus simple?
*/

// let categories = window.localStorage.getItem("http://localhost:5678/api/categories");

// //Au besoin récupération des données des catégories depuis l'API
// if (categories === null) {
//     const answerAPI = await fetch ("http://localhost:5678/api/categories");
//     categories = await answerAPI.json ();

//     const categoriesValue = JSON.stringify(categories);
//     window.localStorage.setItem ("categories", categoriesValue);
// }else{
//     categories = JSON.parse (categories);
// };

// console.log(categories)

// Affichage des boutons filtres sur le DOM en fonction des données dans l'API


function createButtons () {
    // Création du bouton "Tous", indépendant des catégories enregistrées dans l'API.
    const contenerFilters = document.querySelector (".portfolio__filtres");
    const filterAll = document.createElement ("button");
    filterAll.textContent = "Tous";
    //On donne une nom de class à chaque balise button ainsi créée pour faciliter le CSS et le tri.
    filterAll.className = "filters__buttons";
    //On donne l'id "Afficher tout" au bouton "Tous" pour permettre le tri
    filterAll.dataset.id = "Afficher tout";
    
    contenerFilters.appendChild (filterAll);

    // Récupération des noms des catégories en supprimant les doublons.
    const categoryId = new Set();
    for (let i of projects) {
        categoryId.add(i.category.id);
    };

    const categoryName = new Set();
    for (let i of projects) {
        categoryName.add(i.category.name);
    };

    // Création des autres boutons en fonctions des categories.name de la base de données
    for (let i of projects) {
    
    const filtersElement = document.createElement ("button");
    filtersElement.textContent = i.category.name;
   
    contenerFilters.appendChild (filtersElement);

    //On donne une nom de class à chaque balise button ainsi créée pour faciliter le CSS et le tri.
    filtersElement.className = "filters__buttons";
    //On donne une id à chaque bouton équivalent à l'id de chaque catégorie (pas l'index du tableau, autrement il faudrait faire categories.indexOf (i)) pour permettre le tri les projets.
    filtersElement.dataset.id = i.category.id;};
    };

createButtons ()

/*Création du filtre par bouton:
* Le filtre compare l'id de la figure à l'id du bouton, et n'affiche que les résultats égaux.
* Le filtre pour le bouton "Tous" a une id unique en chaîne de caractères "Afficher tout" pour éviter la confusion avec les nombres des id.
*/

const filterButton = document.querySelectorAll (".filters__buttons");

for (let i = 0; i < filterButton.length; i++) {

    filterButton [i].addEventListener ("click", function () {

        if (event.target.dataset.id == "Afficher tout") {
            
            //On efface le contenu pour réafficher la totalité
            document.querySelector (".gallery").innerHTML="";
            createProject (projects);

        }else{

            const filteredprojects = projects.filter (function (project) {
            return event.target.dataset.id == project.categoryId;
            });

            //On efface le contenu avant de le réafficher trié
            document.querySelector (".gallery").innerHTML="";
            createProject (filteredprojects);
        };
    });
};