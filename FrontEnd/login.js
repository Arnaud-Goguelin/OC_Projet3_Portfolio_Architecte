/*Lorsque le couple identifiant et mot de passe n’est pas bon pour se connecter, 
*il faut afficher le message d’erreur: 
*“Erreur dans l’identifiant ou le mot de passe”.
*Lorsque le couple identifiant et mot de passe est correct, 
*alors il faut rediriger vers la page du site avec cette fois ci des boutons d’actions pour éditer le site.
*/

const email = "sophie.bluel@test.tld";
const password = "S0phie";

const emailInput = document.querySelector('[id = "email"]').value;
const passwordInput = document.querySelector('[id = "password"]').value;

// switch (emailInput, passwordInput){
//     case emailInput == email && passwordInput == password :
//         console.log("test réussi");
//     break;
//     case  emailInput != email || passwordInput != password :
//         console.log("Erreur dans l’identifiant ou le mot de passe");
//     break;
// }

if (emailInput == email && passwordInput == password) {
    console.log("test réussi");
}else{
    console.log("Erreur dans l’identifiant ou le mot de passe");
};

