const BASE_URL = "https://api.app.uni-pros.com";

export const register = async ({ email, password }) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Erro: ${res.status}`);
    }
  } catch (err) {
    console.error("Erro no registro:", err);
    throw err;
  }
};

export const login = async ({ email, password }) => {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error(`Erro no login: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      console.log("Token colocado");
      return data;
    } else {
      throw new Error("Token não encontrado na resposta");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    throw err;
  }
};

export const verifyUser = async () => {
  const token = localStorage.getItem("jwt");
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Verificando usuário, status da resposta:", res.status); // Adicione esse log

    if (!res.ok) {
      if (res.status === 401) {
        console.log("Token expirado ou inválido. Removendo token.");
        localStorage.removeItem("jwt");
        window.location.href = "/signin";
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erro: ${res.status}`);
      }
    }

    const data = await res.json();
    if (data.data) {
      console.log("Dados do usuário:", data.data); // Verifique o que está sendo retornado
      return data;
    } else {
      throw new Error("Dados do usuário não encontrados na resposta");
    }
  } catch (err) {
    console.error("Erro na verificação do usuário:", err);
    throw err;
  }
};
