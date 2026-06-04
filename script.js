document.addEventListener('DOMContentLoaded', () => {
  const petsGrid = document.getElementById('petsGrid');
  const petCards = Array.from(document.querySelectorAll('.pet-card'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const searchPets = document.getElementById('searchPets');
  const qtdPets = document.getElementById('qtdPets');
  const qtdSolicitacoes = document.getElementById('qtdSolicitacoes');
  const requestsList = document.getElementById('requestsList');

  const adoptionForm = document.getElementById('adoptionForm');
  const suggestionForm = document.getElementById('suggestionForm');
  const contactForm = document.getElementById('contactForm');

  const petEscolhido = document.getElementById('petEscolhido');

  const textoSugestao = document.getElementById('textoSugestao');
  const contadorSugestao = document.getElementById('contadorSugestao');

  const STORAGE_KEY = 'petvit_requests';

  function setMessage(element, text, isSuccess = true) {
    element.textContent = text;
    element.classList.remove('sucesso', 'erro');
    element.classList.add(isSuccess ? 'sucesso' : 'erro');
  }

  function clearMessage(element) {
    element.textContent = '';
    element.classList.remove('sucesso', 'erro');
  }

  function clearErrors(form) {
    form.querySelectorAll('.error').forEach((small) => {
      small.textContent = '';
    });
  }

  function isValidName(value) {
    return /^[A-Za-zÀ-ÿ\s]{2,}$/.test(value.trim());
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  function getRequests() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveRequest(request) {
    const requests = getRequests();
    requests.unshift(request);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests.slice(0, 8)));
    renderRequests();
  }

  function renderRequests() {
    const requests = getRequests();
    requestsList.innerHTML = '';

    if (requests.length === 0) {
      requestsList.innerHTML = '<p>Nenhuma solicitação salva ainda.</p>';
      qtdSolicitacoes.textContent = '0';
      return;
    }

    qtdSolicitacoes.textContent = String(requests.length);

    requests.forEach((request) => {
      const item = document.createElement('div');
      item.className = 'request-item';
      item.innerHTML = `
        <strong>${request.tipo}</strong>
        <span><strong>Nome:</strong> ${request.nome}</span><br>
        <span><strong>Detalhe:</strong> ${request.detalhe}</span><br>
        <span><strong>Data:</strong> ${request.data}</span>
      `;
      requestsList.appendChild(item);
    });
  }

  function updatePetCount() {
    const visiblePets = petCards.filter((card) => !card.hidden).length;
    qtdPets.textContent = String(visiblePets);
  }

  function applyFilter() {
    const term = searchPets.value.trim().toLowerCase();
    const activeFilter =
      document.querySelector('.filter-btn.active').dataset.filter;

    petCards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const breed = card.dataset.breed.toLowerCase();
      const type = card.dataset.type;

      const matchesSearch = name.includes(term) || breed.includes(term);
      const matchesFilter = activeFilter === 'todos' || activeFilter === type;

      card.hidden = !(matchesSearch && matchesFilter);
    });

    updatePetCount();
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter();
    });
  });

  searchPets.addEventListener('input', applyFilter);

  document.querySelectorAll('.adopt-btn').forEach((button) => {
    button.addEventListener('click', () => {
      petEscolhido.value = button.dataset.pet;
      document
        .getElementById('cadastro')
        .scrollIntoView({ behavior: 'smooth' });
      petEscolhido.focus();
    });
  });

  textoSugestao.addEventListener('input', () => {
    contadorSugestao.textContent = String(textoSugestao.value.length);
  });

  adoptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(adoptionForm);
    const msg = document.getElementById('msgAdocao');
    clearMessage(msg);

    const nome = document.getElementById('nomeAdocao').value.trim();
    const email = document.getElementById('emailAdocao').value.trim();
    const telefone = document.getElementById('telefoneAdocao').value.trim();
    const pet = petEscolhido.value.trim();
    const motivo = document.getElementById('motivoAdocao').value.trim();

    let valid = true;

    if (!isValidName(nome)) {
      document.getElementById('erroNomeAdocao').textContent =
        'Digite um nome válido.';
      valid = false;
    }

    if (!isValidEmail(email)) {
      document.getElementById('erroEmailAdocao').textContent =
        'Digite um e-mail válido.';
      valid = false;
    }

    if (!isValidPhone(telefone)) {
      document.getElementById('erroTelefoneAdocao').textContent =
        'Digite um telefone válido.';
      valid = false;
    }

    if (!pet) {
      document.getElementById('erroPetEscolhido').textContent =
        'Selecione um pet.';
      valid = false;
    }

    if (motivo.length < 20) {
      document.getElementById('erroMotivoAdocao').textContent =
        'Explique melhor sua motivação (mínimo 20 caracteres).';
      valid = false;
    }

    if (!valid) {
      setMessage(msg, 'Corrija os campos destacados antes de enviar.', false);
      return;
    }

    saveRequest({
      tipo: 'Cadastro de adoção',
      nome,
      detalhe: `Pet escolhido: ${pet}`,
      data: new Date().toLocaleString('pt-BR'),
    });

    adoptionForm.reset();
    setMessage(
      msg,
      'Cadastro enviado com sucesso! Sua solicitação foi salva.',
      true,
    );
    contadorSugestao.textContent = '0';
  });

  suggestionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(suggestionForm);
    const msg = document.getElementById('msgSugestao');
    clearMessage(msg);

    const nome = document.getElementById('nomeSugestao').value.trim();
    const email = document.getElementById('emailSugestao').value.trim();
    const texto = textoSugestao.value.trim();

    let valid = true;

    if (!isValidName(nome)) {
      document.getElementById('erroNomeSugestao').textContent =
        'Digite um nome válido.';
      valid = false;
    }

    if (!isValidEmail(email)) {
      document.getElementById('erroEmailSugestao').textContent =
        'Digite um e-mail válido.';
      valid = false;
    }

    if (texto.length < 10) {
      document.getElementById('erroTextoSugestao').textContent =
        'Escreva uma sugestão com pelo menos 10 caracteres.';
      valid = false;
    }

    if (!valid) {
      setMessage(msg, 'Revise os campos da sugestão.', false);
      return;
    }

    saveRequest({
      tipo: 'Sugestão',
      nome,
      detalhe: texto,
      data: new Date().toLocaleString('pt-BR'),
    });

    suggestionForm.reset();
    contadorSugestao.textContent = '0';
    setMessage(msg, 'Sugestão enviada com sucesso!', true);
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(contactForm);
    const msg = document.getElementById('msgContato');
    clearMessage(msg);

    const nome = document.getElementById('nomeContato').value.trim();
    const assunto = document.getElementById('assuntoContato').value.trim();
    const mensagem = document.getElementById('mensagemContato').value.trim();

    let valid = true;

    if (!isValidName(nome)) {
      document.getElementById('erroNomeContato').textContent =
        'Digite um nome válido.';
      valid = false;
    }

    if (!assunto) {
      document.getElementById('erroAssuntoContato').textContent =
        'Selecione um assunto.';
      valid = false;
    }

    if (mensagem.length < 10) {
      document.getElementById('erroMensagemContato').textContent =
        'Escreva uma mensagem com pelo menos 10 caracteres.';
      valid = false;
    }

    if (!valid) {
      setMessage(msg, 'Revise os campos do contato.', false);
      return;
    }

    saveRequest({
      tipo: `Contato: ${assunto}`,
      nome,
      detalhe: mensagem,
      data: new Date().toLocaleString('pt-BR'),
    });

    contactForm.reset();
    setMessage(msg, 'Mensagem enviada com sucesso!', true);
  });

  renderRequests();
  applyFilter();
});
