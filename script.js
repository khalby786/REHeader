var app = new Vue({
  el: '#app',
  data: function() {
    return {
      color: "#1c1c1b",
      background: "#fcfcfc",
      username: "Octocat"
    }
  },
  methods: {
    updateCanvas() {
      var c = document.getElementById("preview");
      var ctx = c.getContext("2d");

      let x = 70;
      let y = 120;

      ctx.fillStyle = this.background;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = this.color;
      ctx.font = "40px Arial";
      ctx.fillText("Hi 👋, I'm", x, y);

      ctx.font = "bold 70px Arial";
      ctx.fillText(this.username, x-3, y+70);
    },
    updateColor() {
      this.color = document.getElementById("color").value;
    },
    updateBackground() {
      this.color = document.getElementById("background").value;
    }
  }
})

function save() {
  var canvas = document.getElementById("preview");
  var img = canvas.toDataURL("image/png");
  document.getElementById('preview-img').src = img;
}