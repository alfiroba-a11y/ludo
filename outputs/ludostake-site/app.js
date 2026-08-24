const app = document.querySelector('#app');
const wrap = document.querySelector('#modalWrap');
const modal = document.querySelector('#modal');

const key = 'ludokes_account';
const sessionKey = 'ludokes_session';

let account = localStorage.getItem(sessionKey)
  ? JSON.parse(localStorage.getItem(key) || 'null')
  : null;

let state = {
  players: 2,
  mode: 'free',
  you: 0,
  bot: 0,
  busy: false
};

const save = () => {
  localStorage.setItem(key, JSON.stringify(account));
};

const money = value => {
  return `KES ${Number(value).toLocaleString('en-KE', {
    minimumFractionDigits: 2
  })}`;
};

function popup(title, text, body = '') {
  modal.innerHTML = `
    <button class="close" onclick="closePopup()">×</button>
    <h2>${title}</h2>
    <p>${text}</p>
    ${body}
  `;

  wrap.classList.add('open');
  wrap.setAttribute('aria-hidden', 'false');
}

function closePopup() {
  wrap.classList.remove('open');
  wrap.setAttribute('aria-hidden', 'true');
}

window.closePopup = closePopup;

wrap.onclick = event => {
  if (event.target === wrap) closePopup();
};

function publicPage() {
  app.innerHTML = `
    <div class="site">
      <header class="nav">
        <div class="brand">Ludo<b>KES</b> <small>🇰🇪</small></div>

        <nav class="nav-links">
          <a href="#how">How it works</a>
          <a href="#play">Play Ludo</a>
          <a href="#safe">Safer play</a>
        </nav>

        <div class="nav-actions">
          <button class="btn btn-plain" id="signin">Sign in</button>
          <button class="btn btn-soft" id="signup">Create account</button>
        </div>
      </header>

      <main>
        <section class="hero">
          <div>
            <p class="eyebrow">KENYA’S LUDO GAME SPACE</p>
            <h1>Play Ludo.<br><em>Make every move count.</em></h1>

            <p>
              Start with a free Ludo game, choose a 2, 3 or 4 player table,
              and set up your profile when you are ready.
            </p>

            <div class="hero-ctas">
              <button class="btn btn-primary" id="heroSignup">
                Create an 18+ account
              </button>

              <a href="#how">How it works →</a>
            </div>
          </div>

          <aside class="flag-card">
            <div class="flag">
              <i></i>
              <i></i>
              <i></i>
            </div>

            <strong>Designed for Kenya.</strong>

            <p>
              Kenyan Shillings, M-PESA-ready wallet architecture,
              and clear 18+ protections.
            </p>
          </aside>
        </section>

        <section class="steps" id="how">
          <p class="eyebrow">HOW IT WORKS</p>
          <h2>A cleaner way to play</h2>

          <div class="step-grid">
            <article class="step">
              <b class="step-no">01</b>
              <h3>Create an 18+ account</h3>
              <p>
                Confirm that you are 18 or older before you enter
                the player dashboard.
              </p>
            </article>

            <article class="step">
              <b class="step-no">02</b>
              <h3>Choose your table</h3>
              <p>
                Pick Free Ludo, a KES 10 practice table, and choose
                2, 3 or 4 players.
              </p>
            </article>

            <article class="step">
              <b class="step-no">03</b>
              <h3>Play with confidence</h3>
              <p>
                Your dashboard keeps your game settings, sandbox wallet
                and profile controls together.
              </p>
            </article>
          </div>
        </section>

        <div class="notice" id="safe">
          <b>18+ only.</b>
          Never play with money you cannot afford to lose.
          Live paid play requires age verification, KYC and licensed payment settlement.
        </div>
      </main>
    </div>
  `;

  document.querySelector('#signup').onclick = authModal;
  document.querySelector('#heroSignup').onclick = authModal;
  document.querySelector('#signin').onclick = loginModal;
}

function authModal() {
  popup(
    'Create your 18+ player account',
    'LudoKES is only for players aged 18 and above.',
    `
      <form class="form" id="authForm">
        <input required name="name" placeholder="Full name">
        <input required name="email" type="email" placeholder="Email address">
        <input required type="password" placeholder="Password">

        <label class="check">
          <input required type="checkbox">
          I confirm that I am 18 years or older.
        </label>

        <label class="check">
          <input required type="checkbox">
          I agree to the safer-play rules.
        </label>

        <button class="btn btn-primary">Create account</button>
      </form>
    `
  );

  document.querySelector('#authForm').onsubmit = event => {
    event.preventDefault();

    const data = new FormData(event.target);

    account = {
      name: data.get('name'),
      email: data.get('email'),
      balance: 0
    };

    save();
    localStorage.setItem(sessionKey, '1');

    closePopup();
    dashboard();

    toast('Account created. Welcome to LudoKES!');
  };
}

function loginModal() {
  popup(
    'Sign in',
    'Enter the email for an account previously created in this browser.',
    `
      <form class="form" id="loginForm">
        <input required name="email" type="email" placeholder="Email address">
        <input required type="password" placeholder="Password">
        <button class="btn btn-primary">Sign in</button>
      </form>
    `
  );

  document.querySelector('#loginForm').onsubmit = event => {
    event.preventDefault();

    const email = new FormData(event.target).get('email');
    const stored = JSON.parse(localStorage.getItem(key) || 'null');

    if (!stored || stored.email !== email) {
      toast('No matching local account. Please create an account.');
      return;
    }

    account = stored;
    localStorage.setItem(sessionKey, '1');

    closePopup();
    dashboard();

    toast('Signed in successfully');
  };
}

function dashboard() {
  if (!account) {
    publicPage();
    return;
  }

  app.innerHTML = `
    <div class="site">
      <header class="nav">
        <div class="brand">Ludo<b>KES</b> <small>🇰🇪</small></div>

        <nav class="nav-links">
          <a href="#game">Game lobby</a>
          <a href="#wallet">Wallet</a>
          <a href="#profile">Profile</a>
        </nav>

        <div class="nav-actions">
          <button class="btn btn-soft" id="signout">Sign out</button>
        </div>
      </header>

      <main class="dashboard">
        <div class="dash-head">
          <div>
            <p class="eyebrow">PLAYER DASHBOARD</p>
            <h1>Karibu, ${escapeHtml(account.name)}.</h1>
            <p>Choose a table, set your players, and start a Ludo game.</p>
          </div>

          <button class="btn btn-soft" id="profileBtn">
            Profile settings
          </button>
        </div>

        <section class="wallet" id="wallet">
          <div>
            <small>WALLET BALANCE</small>
            <strong id="balance">${money(account.balance)}</strong>
            <span>Sandbox wallet — no real payment is processed.</span>
          </div>

          <div class="wallet-actions">
            <button class="btn" id="deposit">Deposit</button>
            <button class="btn btn-outline" id="withdraw">Withdraw</button>
          </div>
        </section>

        <section class="choice-grid" id="game">
          <div class="card">
            <p class="eyebrow">GAME LOBBY</p>
            <h3>Choose your Ludo table</h3>

            <p>Number of players</p>

            <div class="segmented" id="players">
              <button data-p="2" class="active">2 players</button>
              <button data-p="3">3 players</button>
              <button data-p="4">4 players</button>
            </div>

            <div class="game-options" id="modes">
              <button class="game-option active" data-m="free">
                <b>Free Ludo</b>
                <small>No entry fee</small>
              </button>

              <button class="game-option" data-m="practice">
                <b>Practice Ludo</b>
                <small>KES 10 sandbox entry</small>
              </button>
            </div>

            <button class="btn btn-primary" id="startGame">
              Start Ludo game
            </button>
          </div>

          <aside class="card settings" id="profile">
            <p class="eyebrow">YOUR PROFILE</p>
            <h3>Account controls</h3>

            <button class="btn btn-soft" id="edit">Edit profile</button>
            <button class="btn btn-plain" id="delete">Delete account</button>

            <p>
              Real deposits, withdrawals and multiplayer require a secure
              server and verified account.
            </p>
          </aside>
        </section>

        <section class="card game hidden" id="gamePanel">
          <p class="eyebrow">QUICK LUDO TABLE</p>

          <h3 id="gameTitle">Free Ludo · 2 players</h3>

          <p class="game-status" id="status">
            Your turn. Roll the dice to move your piece.
          </p>

          <div class="board" id="board"></div>

          <button class="btn btn-primary" id="roll">
            Roll dice <span id="die">⚄</span>
          </button>

          <p class="game-side" id="score">
            You: 0 / 28 · Ludo bot: 0 / 28
          </p>
        </section>
      </main>
    </div>
  `;

  bindDashboard();
  draw();
}

function bindDashboard() {
  document.querySelector('#signout').onclick = () => {
    account = null;
    localStorage.removeItem(sessionKey);

    publicPage();
    toast('Signed out');
  };

  document.querySelectorAll('#players button').forEach(button => {
    button.onclick = () => {
      state.players = Number(button.dataset.p);

      document.querySelectorAll('#players button').forEach(item => {
        item.classList.toggle('active', item === button);
      });
    };
  });

  document.querySelectorAll('#modes button').forEach(button => {
    button.onclick = () => {
      state.mode = button.dataset.m;

      document.querySelectorAll('#modes button').forEach(item => {
        item.classList.toggle('active', item === button);
      });
    };
  });

  document.querySelector('#startGame').onclick = startGame;
  document.querySelector('#roll').onclick = roll;
  document.querySelector('#deposit').onclick = depositModal;
  document.querySelector('#withdraw').onclick = withdrawModal;
  document.querySelector('#edit').onclick = editModal;
  document.querySelector('#profileBtn').onclick = editModal;
  document.querySelector('#delete').onclick = deleteModal;
}

function startGame() {
  if (state.mode === 'practice' && account.balance < 10) {
    popup(
      'Add sandbox funds',
      'Practice Ludo needs KES 10 in your sandbox wallet. Free Ludo is always available.',
      `
        <button class="btn btn-primary" onclick="closePopup();depositModal()">
          Deposit sandbox funds
        </button>
      `
    );

    return;
  }

  if (state.mode === 'practice') {
    account.balance -= 10;
    save();

    document.querySelector('#balance').textContent = money(account.balance);
  }

  state.you = 0;
  state.bot = 0;
  state.busy = false;

  document.querySelector('#gamePanel').classList.remove('hidden');

  document.querySelector('#gameTitle').textContent =
    `${state.mode === 'free' ? 'Free Ludo' : 'Practice Ludo · KES 10'} · ${state.players} players`;

  document.querySelector('#status').textContent =
    'Your turn. Roll the dice to move your piece.';

  document.querySelector('#roll').disabled = false;

  draw();

  document.querySelector('#gamePanel').scrollIntoView({
    behavior: 'smooth'
  });
}

function draw() {
  const board = document.querySelector('#board');

  if (!board) return;

  board.innerHTML = Array.from({ length: 28 }, (_, index) => {
    return `
      <div class="cell ${index === state.you ? 'you' : ''} ${index === state.bot ? 'bot' : ''}">
        ${index + 1}
      </div>
    `;
  }).join('');

  document.querySelector('#score').textContent =
    `You: ${state.you} / 28 · Ludo bot: ${state.bot} / 28`;
}

function roll() {
  if (state.busy) return;

  state.busy = true;

  const playerRoll = 1 + Math.floor(Math.random() * 6);

  state.you = Math.min(28, state.you + playerRoll);

  document.querySelector('#die').textContent =
    ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][playerRoll - 1];

  document.querySelector('#status').textContent =
    `You rolled ${playerRoll}. Ludo bot is playing…`;

  draw();

  setTimeout(() => {
    const botRoll = 1 + Math.floor(Math.random() * 6);

    state.bot = Math.min(28, state.bot + botRoll);

    draw();

    if (state.you === 28 || state.bot === 28) {
      document.querySelector('#status').textContent =
        state.you === 28
          ? 'You won this Ludo round!'
          : 'Ludo bot won this Ludo round.';

      document.querySelector('#roll').disabled = true;
      return;
    }

    document.querySelector('#status').textContent =
      `Bot rolled ${botRoll}. Your turn.`;

    state.busy = false;
  }, 650);
}

function depositModal() {
  popup(
    'Sandbox deposit',
    'Minimum deposit target: USD 5 (about KES 645). No real money is charged.',
    `
      <form class="form" id="dep">
        <input required name="amount" type="number" min="645" value="645">

        <select>
          <option>M-PESA sandbox</option>
          <option>Card sandbox</option>
        </select>

        <button class="btn btn-primary">Add sandbox funds</button>
      </form>
    `
  );

  document.querySelector('#dep').onsubmit = event => {
    event.preventDefault();

    account.balance += Number(new FormData(event.target).get('amount'));

    save();
    closePopup();

    document.querySelector('#balance').textContent = money(account.balance);

    toast('Sandbox wallet funded');
  };
}

function withdrawModal() {
  popup(
    'Sandbox withdrawal',
    'Minimum withdrawal target: USD 10 (about KES 1,290). No real money is sent.',
    `
      <form class="form" id="wd">
        <input required name="amount" type="number" min="1290" value="1290">
        <input required placeholder="M-PESA phone number">
        <button class="btn btn-primary">Submit sandbox request</button>
      </form>
    `
  );

  document.querySelector('#wd').onsubmit = event => {
    event.preventDefault();

    closePopup();

    toast('Sandbox withdrawal request saved');
  };
}

function editModal() {
  popup(
    'Edit profile',
    'Update your display name for this browser.',
    `
      <form class="form" id="editForm">
        <input required name="name" value="${escapeHtml(account.name)}">
        <button class="btn btn-primary">Save changes</button>
      </form>
    `
  );

  document.querySelector('#editForm').onsubmit = event => {
    event.preventDefault();

    account.name = new FormData(event.target).get('name');

    save();
    closePopup();
    dashboard();

    toast('Profile updated');
  };
}

function deleteModal() {
  popup(
    'Delete account',
    'This removes the local demo account and sandbox balance from this browser.',
    `
      <button class="btn danger" id="confirmDelete">
        Delete my local account
      </button>
    `
  );

  document.querySelector('#confirmDelete').onclick = () => {
    account = null;

    localStorage.removeItem(key);
    localStorage.removeItem(sessionKey);

    closePopup();
    publicPage();

    toast('Local account deleted');
  };
}

function toast(message) {
  const toastElement = document.createElement('div');

  toastElement.className = 'toast';
  toastElement.textContent = message;

  document.body.append(toastElement);

  setTimeout(() => toastElement.remove(), 2700);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[character];
  });
}

window.depositModal = depositModal;

account ? dashboard() : publicPage();
