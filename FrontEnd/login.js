
const connection = document.querySelector ('[id = "connection"]');
/*Au click sur le bouton "Se Connecter", récupérer l'email et password saisi, 
*les envoyer à l'API, 
*s'ils sont bons, être rediriger vers index.html
*/
connection.addEventListener ("click", async function (event){
    event.preventDefault();
    //Récupération des emails et password saisis par l'utilisateur
    const loginInput = {
        email : document.querySelector('[id = "email"]').value,
        password : document.querySelector('[id = "password"]').value,
    };
    //Création de la charge utilise en JSON pour envoie à l'API
    const loginInputJSON = JSON.stringify(loginInput);
    //Envoie à l'API de la charge utile
    const answerAPILogin = await fetch ("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-type" : "application/json"},
        body: loginInputJSON,
    });
    //Récupération du token de connexion
    const login = await answerAPILogin.json();
    console.log(login);
    //Test : si le token de la réponse de l'API est existant, redirection vers la page d'accueil, sinon afficher message d'erreur
    !!login.token ? window.location.href = "index.html" : alert("Erreur dans l'email ou le mot de passe.");
});
