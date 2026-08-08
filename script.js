const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const profile = document.getElementById("profile");

searchBtn.addEventListener("click", function () {

    const username = usernameInput.value.trim();

    if (username === "") {
        profile.innerHTML = `
    <div class="error-message">
        <strong>⚠ Kullanıcı adı gerekli</strong>
        <p>Lütfen bir GitHub kullanıcı adı girin.</p>
    </div>
`;
        return;
    }
profile.innerHTML = `
    <div class="loading">
        <div class="spinner"></div>
        <p>Kullanıcı aranıyor...</p>
    </div>
`;
document.getElementById("repositories").innerHTML = "";

    fetch("https://api.github.com/users/" + username)
        .then(response => {

            if (!response.ok) {
                throw new Error("Kullanıcı bulunamadı");
            }

            return response.json();
        })

        .then(data => {

            profile.innerHTML = `
                <div class="profile-card">

                    <img src="${data.avatar_url}" class="avatar">

                    <h2>${data.name || data.login}</h2>

                    <p class="username">@${data.login}</p>

                    <p>${data.bio || "Bio bulunmuyor."}</p>
<div class="profile-info">

    <p>📍 ${data.location || "Konum belirtilmemiş"}</p>

    <p>🏢 ${data.company || "Şirket belirtilmemiş"}</p>

    <p>
        🌐
        ${
            data.blog
            ? `<a href="${data.blog}" target="_blank">${data.blog}</a>`
            : "Website bulunmuyor"
        }
    </p>

    <p>
        📅 GitHub'a katılma:
        ${new Date(data.created_at).toLocaleDateString("tr-TR")}
    </p>

</div>
                    <div class="stats">

                        <div>
                            <strong>${data.followers}</strong>
                            <span>Followers</span>
                        </div>

                        <div>
                            <strong>${data.following}</strong>
                            <span>Following</span>
                        </div>

                        <div>
                            <strong>${data.public_repos}</strong>
                            <span>Repositories</span>
                        </div>

                    </div>

                    <a href="${data.html_url}" target="_blank">
                        Github Profiline Git
                    </a>
                </div>
            `;

            // Repository'leri getir
            return fetch(
                `https://api.github.com/users/${data.login}/repos?sort=updated&per_page=5`
            );
        })

        .then(response => response.json())

        .then(repos => {

            let reposHTML = `
                <div class="repositories">
                    <h3>Son Repository'ler</h3>
            `;

            if (repos.length === 0) {

                reposHTML += `
                    <p>Bu kullanıcının henüz repository'si yok.</p>
                `;

            } else {

            repos.forEach(repo => {
    reposHTML += `
        <div class="repo">
            <h4>${repo.name}</h4>

            <p>
                ${repo.description || "Açıklama bulunmuyor."}
            </p>

            <div class="repo-stats">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>${repo.language || "Dil belirtilmemiş"}</span>
            </div>
<p class="repo-date">
    🕐 Son güncelleme:
    ${new Date(repo.updated_at).toLocaleDateString("tr-TR")}
</p>
            <a href="${repo.html_url}" target="_blank">
                Repository'yi Gör
            </a>
        </div>
    `;
});
            }

            reposHTML += `</div>`;

            document.getElementById("repositories").innerHTML=reposHTML;
        })

        .catch(error => {

            console.error(error);

           profile.innerHTML = `
    <div class="error-message">
        <strong>⚠ Kullanıcı bulunamadı</strong>
        <p>Bu kullanıcı adıyla eşleşen bir GitHub hesabı yok.</p>
    </div>
`;
        });
});
// Enter tuşuyla arama
usernameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});