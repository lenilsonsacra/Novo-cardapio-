// CONFIGURAÇÕES DO ESTABELECIMENTO
const CONFIG = {
  whatsappNumero: "5571981820438", // Coloque o número do WhatsApp com DDD (apenas números)
  taxaServicoPercentual: 10 // Taxa de 10%
};

// DADOS DO CARDÁPIO
const CATEGORIAS = [
  { id: 'todos', nome: 'Todos', icone: 'fa-list' },
  { id: 'petiscos', nome: 'Petiscos', icone: 'fa-drumstick-bite' },
  { id: 'cervejas', nome: 'Cervejas', icone: 'fa-beer-mug-empty' },
  { id: 'drinks', nome: 'Drinks & Coquetéis', icone: 'fa-glass-martini-alt' },
  { id: 'sem-alcool', nome: 'Sem Álcool', icone: 'fa-bottle-water' }
];

const PRODUTOS = [
  {
    id: 1,
    nome: "Carne de Sol com Aipim",
    categoria: "petiscos",
    preco: 58.90,
    descricao: "500g de carne de sol acebolada, acompanhada de aipim frito bem crocante e manteiga de garrafa.",
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    destaque: true
  },
  {
    id: 2,
    nome: "Batata Suprema com Bacon",
    categoria: "petiscos",
    preco: 36.00,
    descricao: "Porção generosa de batatas rústicas cobertas com molho cheddar cremoso e bacon crocante.",
    imagem: "https://i.pinimg.com/1200x/13/f5/17/13f5174923c5a77ec64ad26adf79611e.jpg",
    destaque: false
  },
  {
    id: 3,
    nome: "Frango a Passarinho",
    categoria: "petiscos",
    preco: 42.50,
    descricao: "Cortes selecionados crocantes ao alho e óleo, finalizados com cheiro-verde fresco e maionese da casa.",
    imagem: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80",
    destaque: false
  },
  {
    id: 4,
    nome: "Cerveja Heineken 600ml",
    categoria: "cervejas",
    preco: 16.00,
    descricao: "Garrafa trincando de gelada.",
    imagem: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80",
    destaque: true
  },
  {
    id: 5,
    nome: "Caipirinha de Limão",
    categoria: "drinks",
    preco: 18.00,
    descricao: "Cachaça artesanal premium, limão taiti fresco e açúcar na medida certa.",
    imagem: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    destaque: false
  },
  {
    id: 6,
    nome: "Gin Tônica Tropical",
    categoria: "drinks",
    preco: 26.00,
    descricao: "Gin Tanqueray, tônica, rodela de laranja e xarope de maracujá artesanal.",
    imagem: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    destaque: false
  },
  {
    id: 7,
    nome: "Refrigerante Lata",
    categoria: "sem-alcool",
    preco: 7.00,
    descricao: "Coca-Cola, Guaraná Antarctica ou Sprite 350ml.",
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    destaque: false
  }
];

// ESTADO DA APLICAÇÃO
let numeroMesa = "01";
let categoriaAtiva = "todos";
let termoBusca = "";
let carrinho = [];

// INICIALIZAÇÃO DA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
  solicitarMesaInicial();
  renderizarCategorias();
  renderizarProdutos();
  atualizarInterfaceCarrinho();

  // Evento de Busca
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      termoBusca = e.target.value.toLowerCase();
      renderizarProdutos();
    });
  }
});

// GESTÃO DA MESA
function solicitarMesaInicial() {
  const mesaSalva = localStorage.getItem("boteco_mesa");
  if (mesaSalva) {
    numeroMesa = mesaSalva;
  } else {
    const mesaInput = prompt("Seja bem-vindo! Digite o número da sua mesa:", "01");
    if (mesaInput) {
      numeroMesa = mesaInput.trim();
      localStorage.setItem("boteco_mesa", numeroMesa);
    }
  }
  const displayMesa = document.getElementById("display-mesa");
  if (displayMesa) displayMesa.innerText = numeroMesa;
}

function alterarMesa() {
  const novaMesa = prompt("Digite o novo número da sua mesa:", numeroMesa);
  if (novaMesa) {
    numeroMesa = novaMesa.trim();
    localStorage.setItem("boteco_mesa", numeroMesa);
    const displayMesa = document.getElementById("display-mesa");
    if (displayMesa) displayMesa.innerText = numeroMesa;
  }
}

// RENDERIZAÇÃO DAS CATEGORIAS
function renderizarCategorias() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  container.innerHTML = CATEGORIAS.map(cat => `
    <button 
      onclick="selecionarCategoria('${cat.id}')"
      class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition ${
        categoriaAtiva === cat.id
          ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
      }"
    >
      <i class="fa-solid ${cat.icone}"></i>
      <span>${cat.nome}</span>
    </button>
  `).join("");
}

function selecionarCategoria(catId) {
  categoriaAtiva = catId;
  renderizarCategorias();
  renderizarProdutos();
}

// RENDERIZAÇÃO DOS PRODUTOS
function renderizarProdutos() {
  const container = document.getElementById("menu-container");
  if (!container) return;
  
  const produtosFiltrados = PRODUTOS.filter(p => {
    const bateCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
    const bateBusca = p.nome.toLowerCase().includes(termoBusca) || p.descricao.toLowerCase().includes(termoBusca);
    return bateCategoria && bateBusca;
  });

  if (produtosFiltrados.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-zinc-500">
        <i class="fa-solid fa-utensils text-3xl mb-2"></i>
        <p class="text-sm">Nenhum item encontrado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = produtosFiltrados.map(p => {
    const noCarrinho = carrinho.find(item => item.id === p.id);
    const qtd = noCarrinho ? noCarrinho.quantidade : 0;

    return `
      <div class="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3.5 flex gap-3.5 shadow-sm relative overflow-hidden">
        ${p.destaque ? `<span class="absolute top-2 right-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">MAIS PEDIDO</span>` : ''}
        
        <img src="${p.imagem}" alt="${p.nome}" class="w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-zinc-800" loading="lazy">
        
        <div class="flex flex-col justify-between flex-1">
          <div>
            <h3 class="font-bold text-sm text-zinc-100 leading-tight">${p.nome}</h3>
            <p class="text-xs text-zinc-400 line-clamp-2 mt-1 leading-snug">${p.descricao}</p>
          </div>
          
          <div class="flex items-center justify-between mt-3">
            <span class="text-sm font-black text-brand-500">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
            
            ${qtd === 0 ? `
              <button 
                onclick="adicionarAoCarrinho(${p.id})"
                class="bg-zinc-800 hover:bg-brand-500 hover:text-white text-zinc-200 border border-zinc-700/60 text-xs font-bold px-3 py-1.5 rounded-lg transition active:scale-95 flex items-center gap-1.5"
              >
                <i class="fa-solid fa-plus"></i> Adicionar
              </button>
            ` : `
              <div class="flex items-center bg-zinc-800 border border-zinc-700/60 rounded-lg overflow-hidden">
                <button onclick="alterarQuantidade(${p.id}, -1)" class="w-7 h-7 flex items-center justify-center text-zinc-300 hover:bg-zinc-700 active:scale-90">
                  <i class="fa-solid fa-minus text-[10px]"></i>
                </button>
                <span class="w-6 text-center text-xs font-bold text-white">${qtd}</span>
                <button onclick="alterarQuantidade(${p.id}, 1)" class="w-7 h-7 flex items-center justify-center text-brand-500 hover:bg-zinc-700 active:scale-90">
                  <i class="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// LOGICA DO CARRINHO
function adicionarAoCarrinho(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) return;

  const itemExistente = carrinho.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }

  atualizarInterfaceCarrinho();
  renderizarProdutos();
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;

  item.quantidade += delta;
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.id !== id);
  }

  atualizarInterfaceCarrinho();
  renderizarProdutos();
}

function atualizarInterfaceCarrinho() {
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const taxa = subtotal * (CONFIG.taxaServicoPercentual / 100);
  const totalGeral = subtotal + taxa;

  // Atualiza Barra Inferior
  const cartBadge = document.getElementById("cart-count-badge");
  const cartTotalBar = document.getElementById("cart-total-bar");
  if (cartBadge) cartBadge.innerText = totalItens;
  if (cartTotalBar) cartTotalBar.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

  // Atualiza Modal
  const subtotalEl = document.getElementById("cart-subtotal");
  const taxaEl = document.getElementById("cart-taxa");
  const totalModalEl = document.getElementById("cart-total-modal");

  if (subtotalEl) subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  if (taxaEl) taxaEl.innerText = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
  if (totalModalEl) totalModalEl.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

  // Renderiza itens no modal
  const listContainer = document.getElementById("cart-items-list");
  if (!listContainer) return;

  if (carrinho.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-8 text-zinc-500">
        <i class="fa-solid fa-cart-flatbed text-3xl mb-2"></i>
        <p class="text-xs">Sua comanda está vazia no momento.</p>
      </div>
    `;
  } else {
    listContainer.innerHTML = carrinho.map(item => `
      <div class="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
        <div class="flex-1 pr-2">
          <h4 class="text-xs font-bold text-zinc-100">${item.nome}</h4>
          <span class="text-[11px] text-zinc-400">R$ ${item.preco.toFixed(2).replace('.', ',')} un.</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-zinc-800 border border-zinc-700/60 rounded-lg">
            <button onclick="alterarQuantidade(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center text-zinc-300">
              <i class="fa-solid fa-minus text-[9px]"></i>
            </button>
            <span class="w-5 text-center text-xs font-bold text-white">${item.quantidade}</span>
            <button onclick="alterarQuantidade(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center text-brand-500">
              <i class="fa-solid fa-plus text-[9px]"></i>
            </button>
          </div>
          <span class="text-xs font-bold text-zinc-200 min-w-[55px] text-right">
            R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    `).join("");
  }
}

// CONTROLE DO MODAL
function abrirModalCarrinho() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => modal.classList.add("show"), 10);
}

function fecharModalCarrinho() {
  const modal = document.getElementById("cart-modal");
  if (!modal) return;
  modal.classList.remove("show");
  setTimeout(() => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }, 300);
}

// ENVIO DE PEDIDO VIA WHATSAPP
function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um item ao carrinho antes de enviar o pedido.");
    return;
  }

  const obsInput = document.getElementById("cart-obs");
  const obs = obsInput ? obsInput.value.trim() : "";
  const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const taxa = subtotal * (CONFIG.taxaServicoPercentual / 100);
  const totalGeral = subtotal + taxa;

  let texto = `*NOVO PEDIDO - MESA ${numeroMesa}*\n`;
  texto += `--------------------------------\n`;

  carrinho.forEach(item => {
    texto += `• *${item.quantidade}x* ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  texto += `--------------------------------\n`;
  if (obs) {
    texto += `*Obs:* ${obs}\n`;
  }
  texto += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  texto += `*Taxa (10%):* R$ ${taxa.toFixed(2).replace('.', ',')}\n`;
  texto += `*TOTAL:* *R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n`;

  const urlWhatsApp = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(texto)}`;
  window.open(urlWhatsApp, "_blank");
}