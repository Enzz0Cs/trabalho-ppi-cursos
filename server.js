const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs'); 

const app = express();
const PORT = 3000;

const USUARIO_VALIDO = {
    usuario: 'admin',
    senha: '123456'
};

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'um-segredo-muito-forte',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 900000 }
}));
app.use(express.static(path.join(__dirname, 'publico')));

const checarAutenticacao = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        req.session.returnTo = req.originalUrl; 
        res.redirect('/login.html');
    }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'publico', 'paginainicial.html'));
});

// Rota para processar o login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === USUARIO_VALIDO.usuario && senha === USUARIO_VALIDO.senha) {
        req.session.loggedin = true;

        const returnTo = req.session.returnTo;
        delete req.session.returnTo;

        res.redirect(returnTo || '/');

    } else {
        res.send('Utilizador ou senha inválidos! <a href="/login.html">Tentar novamente</a>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});


app.get('/detalhes/:nomeArquivo', checarAutenticacao, (req, res) => {
    const nomeArquivo = req.params.nomeArquivo;
    const caminhoArquivo = path.join(__dirname, 'privado', 'detalhes', nomeArquivo);

    if (fs.existsSync(caminhoArquivo)) {
        res.sendFile(caminhoArquivo);
    } else {
        res.status(404).send('Página de detalhes não encontrada.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});
