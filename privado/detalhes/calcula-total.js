
document.addEventListener('DOMContentLoaded', () => {

    const precoUnitarioElemento = document.getElementById('preco-unitario');
    const quantidadeElemento = document.getElementById('quantidade');
    const valorTotalElemento = document.getElementById('valor-total');

    if (!precoUnitarioElemento || !quantidadeElemento || !valorTotalElemento) {
        console.error("Erro: Um ou mais elementos de cálculo não foram encontrados na página.");
        return;
    }

    const precoUnitario = parseFloat(precoUnitarioElemento.textContent);

    function atualizarValorTotal() {

        const quantidade = parseInt(quantidadeElemento.value);


        const total = precoUnitario * quantidade;

        const totalFormatado = total.toFixed(2).replace('.', ',');

        valorTotalElemento.textContent = totalFormatado;
    }

    quantidadeElemento.addEventListener('input', atualizarValorTotal);

});
