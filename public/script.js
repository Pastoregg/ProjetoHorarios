// Função para enviar o arquivo de planilha
document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('planilha', document.getElementById('planilha').files[0]);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
});

// Função para pesquisar cidades (autocomplete)
document.getElementById('cidade').addEventListener('input', function (e) {
  const query = e.target.value;
  if (query.length > 2) {
    fetch(`http://localhost:3000/cidades?q=${query}`)
      .then(response => response.json())
      .then(data => {
        const resultados = document.getElementById('resultados');
        resultados.innerHTML = '';
        data.forEach(cidade => {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.textContent = cidade;
          li.style.cursor = 'pointer'; // Faz o item parecer clicável
          li.addEventListener('click', () => {
            buscarDadosCidade(cidade);
          });
          resultados.appendChild(li);
        });
      });
  }
});

// Função para buscar os dados completos de uma cidade
function buscarDadosCidade(nomeCidade) {
  fetch(`http://localhost:3000/cidade/${nomeCidade}`)
    .then(response => response.json())
    .then(data => {
      exibirDadosCidade(data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Função para exibir os dados da cidade
function exibirDadosCidade(dados) {
  const resultados = document.getElementById('resultados');
  resultados.innerHTML = `
    <li class="list-group-item">
      <strong>Cidade:</strong> ${dados.nome}
    </li>
    <li class="list-group-item">
      <strong>UF:</strong> ${dados.uf}
    </li>
    <li class="list-group-item">
      <strong>Segunda:</strong> ${dados.segunda === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Terça:</strong> ${dados.terca === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Quarta:</strong> ${dados.quarta === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Quinta:</strong> ${dados.quinta === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Sexta:</strong> ${dados.sexta === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Sábado:</strong> ${dados.sabado === 1 ? 'Disponível' : 'Indisponível'}
    </li>
    <li class="list-group-item">
      <strong>Domingo:</strong> ${dados.domingo === 1 ? 'Disponível' : 'Indisponível'}
    </li>
  `;
}