import Sequelize from 'sequelize'

const sequelize = new Sequelize(
    'spotifake',
    'postgres',
    'postgres',
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
)
const User = sequelize.define('user', {
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    sobrenome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    dataNascimento: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'inativo'
    },
    cpf: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    foto: {
        type: Sequelize.DataTypes.STRING
    }
});

const Artista = sequelize.define('artist', {
    nome: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    }
})


const Album = sequelize.define('album', {
    title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    coverImageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
    },
});

Album.belongsTo(Artista, {
    foreignKey: 'artistaId',
    onDelete: 'CASCADE',
});

Artista.hasMany(Album, {
    foreignKey: 'artistaId',
    as: 'Albums'
});

const Musica = sequelize.define('musica', {
    titulo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
    duracao: {
        type: Sequelize.DataTypes.INTEGER,  // Duração em segundos
        allowNull: false,
    },
    fileUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
    },
});

Musica.belongsTo(Album, {
    foreignKey: 'albumId',
    onDelete: 'CASCADE',
});
Musica.belongsTo(Artista, {
    foreignKey: 'artistaId',
    onDelete: 'CASCADE',
});
Album.hasMany(Musica, {
    foreignKey: 'albumId',
    as: 'Musicas'
});



const criarTabelas = () => {
    sequelize.authenticate().then(() => {
        console.log('conectou')
    })
        .catch((err) => {
            console.log(err)
        })
    sequelize.sync({ alter: true }).then(() => {
        console.log('tabela criada')
    })
}


export { User, sequelize, criarTabelas, Artista, Album, Musica };