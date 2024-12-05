import bcryptjs from 'bcryptjs'
import { User } from '../db.js'
import jsonwebtoken from 'jsonwebtoken'

const registro = async (req, res) => {
    // verificar se todos os campos foram enviados
    try {
        const { nome, sobrenome, email, senha, dataNascimento } = req.body
        if (!nome || !sobrenome || !email || !senha || !dataNascimento) {
            res.status(406).send('todos os campos devem ser preenchidos')
            return
        }

        if (await User.findOne({ where: { email: email } })) {
            res.status(400).send('usuario ja existente no sistema')
            return
        }

        const senhaSegura = bcryptjs.hashSync(senha, 10)
        const novoUsuario = User.create({
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            senha: senhaSegura,
            dataNascimento: dataNascimento,
        })
        res.status(200).send('ok, usuario criado')
    } catch (erro) {
        console.log(erro)
    }
} 
const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'tem que preencher tudo cabaço' });
    }

    const userExist = await User.findOne({ where: { email: email } });
    if (!userExist) {
        return res.status(404).json({ error: 'Esse Usuario Não Existe' });
    }

    const senhaValida = bcryptjs.compareSync(senha, userExist.senha);
    if (!senhaValida) {
        return res.status(401).json({ error: 'Senha invalida' });
    }

    const token = jsonwebtoken.sign(
        {
            "nome_completo": `${userExist.nome} ${userExist.sobrenome}`,
            "email": userExist.email,
            "status": userExist.status
        },
        'chavecriptografiajwt',
        { expiresIn: '5m' }
    );

    res.json({
        msg: "Usuario Logado",
        tokenJWT: token
    });

}

export { registro, login }