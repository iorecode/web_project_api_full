class API {
  constructor(baseURL) {
    this._baseURL = baseURL;
  }

  get _headers() {
    const token = localStorage.getItem("jwt");
    return {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return res
      .json()
      .then((data) => {
        const error = new Error(data.message || `Error: ${res.status}`);
        error.status = res.status;
        return Promise.reject(error);
      })
      .catch((err) => {
        console.error(err);
        return Promise.reject(err);
      });
  }

  getCardList() {
    return fetch(`${this._baseURL}/cards`, {
      headers: this._headers,
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      }) // Acessa a chave "data"
      .catch((err) => {
        console.error("Error in getCardList:", err);
        return Promise.reject(err);
      });
  }

  getUserData() {
    return fetch(`${this._baseURL}/users/me`, {
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch((err) => {
        console.error("Error in getUserData:", err);
        return Promise.reject(err);
      });
  }

  saveProfileChanges({ name, about }) {
    return fetch(`${this._baseURL}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error("Error in saveProfileChanges:", err);
        return Promise.reject(err);
      });
  }

  updateAvatar({ avatar }) {
    return fetch(`${this._baseURL}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error("Error in updateAvatar:", err);
        return Promise.reject(err);
      });
  }

  addNewCard({ name, link }) {
    return fetch(`${this._baseURL}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error("Error in addNewCard:", err);
        return Promise.reject(err);
      });
  }

  deleteCard(cardId) {
    return fetch(`${this._baseURL}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .catch((err) => {
        console.error("Error in deleteCard:", err);
        return Promise.reject(err);
      });
  }

  addLike(cardId) {
    return fetch(`${this._baseURL}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error("Error in addLike:", err);
        return Promise.reject(err);
      });
  }

  removeLike(cardId) {
    return fetch(`${this._baseURL}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    })
      .then(this._checkResponse)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error("Error in removeLike:", err);
        return Promise.reject(err);
      });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.addLike(cardId) : this.removeLike(cardId);
  }
}

const api = new API("https://api.app.uni-pros.com");

export default api;
