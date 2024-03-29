const gameContainer = document.querySelector(".container"),
  userResult = document.querySelector(".user_result img"),
  cpuResult = document.querySelector(".cpu_result img"),
  result = document.querySelector(".result"),
  optionImages = document.querySelectorAll(".option_image");

optionImages.forEach((image, index) => {
  image.addEventListener("click", (e) => {
    image.classList.add("active");

    userResult.src = cpuResult.src = "images/rock.png";
    result.textContent = "Kamień!";
    setTimeout(() => {
      result.textContent = "Papier!";
      userResult.src = cpuResult.src = "images/paper.png";
    }, 500);
    setTimeout(() => {
      result.textContent = "Nożyce!";
      userResult.src = cpuResult.src = "images/scissors.png";
    }, 1000);

    optionImages.forEach((image2, index2) => {
      index !== index2 && image2.classList.remove("active");
    });

    gameContainer.classList.add("start");

    setTimeout(() => {
      gameContainer.classList.remove("start");
      let imageSrc = e.target.querySelector("img").src;
      userResult.src = imageSrc;
      let randomNumber = Math.floor(Math.random() * 3);
      let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
      cpuResult.src = cpuImages[randomNumber];
      let cpuValue = ["R", "P", "S"][randomNumber];
      let userValue = ["R", "P", "S"][index];
      let outcomes = {
        RR: "Draw",
        RP: "Komputer",
        RS: "Gracz",
        PP: "Draw",
        PR: "Gracz",
        PS: "Komputer",
        SS: "Draw",
        SR: "Komputer",
        SP: "Gracz",
      };
      let outComeValue = outcomes[userValue + cpuValue];
      result.textContent = userValue === cpuValue ? "Remis!" : `${outComeValue} Wygrywa!`;
    }, 1500);
  });
});
 