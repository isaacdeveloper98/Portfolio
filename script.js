const titulo = document.querySelector(".topo-titulo p");

function textoEscrever(elemento) {
    const textoArray = elemento.innerText.split("");
    elemento.innerHTML = "";

    textoArray.forEach((letra, index) => {
        setTimeout(function () {
            elemento.innerHTML += letra;
        }, 75 * index);
    });
}

textoEscrever(titulo);
setInterval(() => {
    textoEscrever(titulo);
}, 10000);

const debouce = function (func, wait, immediate) {
    let timeout;
    return function (...args) {
        const context = this;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const animacao = document.querySelectorAll("[data-anime]");
const animacaoClasse = "animate";

function animacaoScroll() {
    const windowTop = window.pageYOffset + window.innerHeight * 0.75;
    animacao.forEach(function (elemento) {
        if (windowTop > elemento.offsetTop) {
            elemento.classList.add(animacaoClasse);
        } else {
            elemento.classList.remove(animacaoClasse);
        }
        console.log(elemento.offsetTop);
    });
}

animacaoScroll();

if (animacao.length) {
    window.addEventListener(
        "scroll",
        debouce(function () {
            animacaoScroll();
        }, 100)
    );
}