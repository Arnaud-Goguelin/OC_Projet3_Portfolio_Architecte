let modal = null;
let modalOpeningMeter = 0;


//Appel à l'API pour récupérer tous les works
    const answerAPIWorks = await fetch("http://localhost:5678/api/works");
    const works = await answerAPIWorks.json ();

//Affichage des projets sur le DOM en fonction des works récupérer précédement
function createWorks(works) {
    let contenerGallery = document.querySelector(".gallery");
    contenerGallery.innerHTML ="";

    if (modalOpeningMeter != 0) {
        contenerGallery = document.querySelector(".modal__window__gallery");
        contenerGallery.innerHTML ="";

        const modalHeader = document.querySelector(".modal__window__header");
        modalHeader.innerHTML ="";
        const modalTitle = document.createElement("h3");
        modalTitle.innerText = "Galerie Photo";
        modalHeader.appendChild(modalTitle);

        const modalFooter = document.querySelector(".modal__window__footer");
        modalFooter.innerHTML ="";

        const modalButtonAddphoto = document.createElement("button");
        modalButtonAddphoto.textContent = "Ajouter une photo";
        modalFooter.appendChild(modalButtonAddphoto);

        const modalButtonDelete = document.createElement("button");
        modalButtonDelete.textContent = "Supprimer la galerie";
        modalFooter.appendChild(modalButtonDelete);
        modalButtonDelete.id ="modal__footer__delete_gallery";
    }
        for (const work in works) {
            const figureElement = document.createElement("figure");
            contenerGallery.appendChild(figureElement);
 
            const imageWork = document.createElement("img");
            imageWork.src = works[work].imageUrl;
            figureElement.appendChild(imageWork);

            if (modalOpeningMeter != 0) {
                const publishButton = document.createElement("button");
                publishButton.innerText = "éditer";
                figureElement.appendChild(publishButton);

            }else{
                const captionWork = document.createElement("figcaption");
                captionWork.innerText = works[work].title;
                   figureElement.appendChild(captionWork);
         };
        };
}

createWorks(works);


/* Création d'un affichage dynamique des boutons :
*
* L'intérêt est de créer un affichage dynamique des boutons filtres en fonction des noms catégories des projets, 
* avec une fonction filtre se mettant à jour automatiquement, 
* selon le nombre de catégorie créé lors de la sauvegarde d'un nouveau projet dans d'API.
*
*/

//Appel à l'API pour récupérer les catégories de works
const answerAPICategories = await fetch("http://localhost:5678/api/categories");
const categories = await answerAPICategories.json ();

//Affichage du conteneur des boutons puis des boutons filtres sur le DOM en fonction des catégories récupérées précédement
function createButtonsBox () {
    
    const contenerFilters = document.querySelector(".portfolio__filtres");
    //Ajout d'une catégorie "Tous" dans le tableau categories avec l'id "0"
    categories.unshift({id:0,name:"Tous"})
    //Pour chaque category de categories, création d'un bouton grâche à la fonction createCategoryButton
    for (const category of categories) {
        const buttons = createCategoryButton(category);
        contenerFilters.appendChild(buttons);
    }
}

createButtonsBox ();

/*Déclaration d'une fonction pour afficher un bouton par category de categories, 
et lui appliquer un filtre pour n'afficher que les works dont l'id correspond à la l'id de la category utilisée.
*/
function createCategoryButton(category) {
    //Création des balises HTML "button" et du texte à affiché
    const filtersElement = document.createElement("button");
    filtersElement.textContent = category.name;
    //Ajout d'une class CSS pour la mise en page
    filtersElement.classList.add("filters__buttons");
    //Par défaut, ajout d'une class CSS au bouton "Tous" pour la mise en page du filtre actif
    category.id === 0 ? filtersElement.classList.add("portfolio__button_active") : null;

    //Au click, déclenchement d'un filtre pour n'afficher que les works dont la categoryId correspond à la category.id du bouton clicqué
    filtersElement.addEventListener("click", (event)=>{
    const workFiltered = category.id === 0 ? works : works.filter(work => work.categoryId === category.id);
    //Affichage des works filtrés
    createWorks(workFiltered);
    //Modification des class CSS des boutons pour modifier la mise en page du bouton actif et l'appliquer au bouton cliqué.
    document.querySelector(".portfolio__button_active").classList.remove("portfolio__button_active");
    event.target.classList.add("portfolio__button_active");
    });

    return filtersElement;
}

//Gestion de la session admin

let token;

//Stockage de token enregistré dans le sessionStorage (cf.login.js) et déclenchement de la function removeAdminCSSClass s'il n'est pas nul.
function displayAdminSession (token) {
    token = window.sessionStorage.getItem("token");
    token ? removeAdminCSSClass() : null;
}

// Affichage des éléments du DOM spécifique à la session admin

function removeAdminCSSClass () {
    // Sélection de tous les éléments du DOM avec la classe ".session_admin_inactive",
    // Suppression de cette classe pour permettre leur affichage (en display none dans le CSS)
    const allAdminSessionElements = document.querySelectorAll(".session_admin_inactive");
    allAdminSessionElements.forEach(
        (adminSessionElement) => {adminSessionElement.classList.remove("session_admin_inactive")});

    // Sélection de tous les élements du DOM avec la classe ".session_public_active",
    // Suppression de cette classe et ajout de la classe ".session_admin_inactive",
    // Afin de ne plus afficher ces éléments tant que la session admin est ouverte.
    const allPublicSessionElements = document.querySelectorAll(".session_public_active");
    allPublicSessionElements.forEach(
        (publicSessionElement) => {
            publicSessionElement.classList.remove("session_public_active");
            publicSessionElement.classList.add("session_admin_inactive");
        });
}

displayAdminSession (token);

//Au click, nettoyage du sessionStorage pour supprimer le token. Pas de token, pas d'affichage (cf. fonction displayAdminSession et removeAdminCSSClass ci-dessus).
function disconnect () {
    const logout = document.querySelector(".nav__session_admin");
    logout.addEventListener("click", sessionStorage.clear());
}

disconnect();

/* Pour la modale:
* vérifier l'utilité de Element.remove()
*/

//Gestion de la modale


const openModalButton = document.querySelector(".portfolio__session_admin");
modal = document.querySelector(".modal__container");
openModalButton.addEventListener("click", function (){
    modal.style.display = null;
    modalOpeningMeter ++;
    createWorks(works);
});

const modalCloseButton = document.querySelector(".modal__close_button");
modalCloseButton.addEventListener("click", function closeModal(){
    modal.style.display = "none";
    modalOpeningMeter = 0;
    createWorks(works);
});

modal.addEventListener("click", function (){
    modal.style.display = "none";
    modalOpeningMeter = 0;
    createWorks(works);
});
const modalStopPropagation = document.querySelector(".modal__window");
modalStopPropagation.addEventListener("click", function () {event.stopPropagation ()});

