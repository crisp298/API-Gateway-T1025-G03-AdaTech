// Importação dos módulos necessários
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Criação da instância do Express
const app = express();
// Configuração da porta que o servidor irá ouvir
const PORT = process.env.GATEWAY_PORT || 4000;

// URLs dos microsserviços de eventos e usuários obtidos das variáveis de ambiente
const EVENTS_SERVICE_URL = process.env.EVENTS_SERVICE_URL;
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

// Middleware para parsear o corpo da requisição em formato JSON
app.use(express.json());

// Rota para lidar com as solicitações relacionadas a eventos
app.use("/events", async (req, res) => {
  try {
        const url = `${EVENTS_SERVICE_URL}${req.url}`;//concatena o endereço padrão passao com o que foi pedido na requisição do app.use para montar a url final de endereço a ser buscado no microsserviço
        const method = req.method;//chama o métodoa http da requsição
        const data = req.body;//chama o dado da requisição
        const response = await axios({//usa como parâmetro method, data e url a ser chamada
          method,
          data,
          url,
        });
        res.status(response.status).send(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)){
          res.status(error.response?.status || 500).send(error.response?.data);
        } else {
          res.status(500).send({message: "Um erro inesperado aconteceu"});
        }
  }
});

// Inicia o servidor na porta configurada
app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
