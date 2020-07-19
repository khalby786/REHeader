var app = new Vue({
  el: '#app',
  data: function() {
    return {
      color: "#1c1c1b",
      background: "#db7b7b",
      username: "Octocat",
      introcolor: "#1c1c1b",
      introtext: "Hi 👋, I'm",
      fonts: ['monospace', 'Roboto', 'Red Rose', 'Playfair Display', 'Baloo Da 2', 'IBM Plex Mono', 'Fira Mono', 'Inter', 'PT Serif']
    }
  },
  mounted: function() {
    var c = document.getElementById("preview");
    var ctx = c.getContext("2d");

    let x = 70;
    let y = 120;
      
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = this.introcolor;
    ctx.font = "40px Arial";
    ctx.fillText(this.introtext, x, y);
      
    ctx.fillStyle = this.color;
    ctx.font = "bold 70px Arial";
    ctx.fillText(this.username, x-3, y+70);
    
//     console.log('prepare to sort')
//     this.fonts.sort();
//     console.log('sorting success!')
    
//     this.fonts.forEach(font => {
//       console.log(font);
//       let option = document.createElement('option');
//       option.value = font.toLowerCase();
//       option.style.fontFamily = font;
//       document.getElementById('fonts1').appendChild(option);
//     });
    
  },
  methods: {
    updateCanvas() {
      var c = document.getElementById("preview");
      var ctx = c.getContext("2d");

      let x = 70;
      let y = 120;
      
      ctx.fillStyle = this.background;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = this.introcolor;
      ctx.font = "40px Arial";
      ctx.fillText(this.introtext, x, y);
      
      ctx.fillStyle = this.color;
      ctx.font = "bold 70px Arial";
      ctx.fillText(this.username, x-3, y+70);
    },
    updateColor() {
      this.color = document.getElementById("color").value;
      this.updateCanvas();
    },
    updateBackground() {
      this.background = document.getElementById("background").value;
      this.updateCanvas();
    },
    updateIntroColor() {
      this.introcolor = document.getElementById("introcolor").value;
      this.updateCanvas();
    },
    getBase64(img) {
      var canvas = document.getElementById("base64-preview");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },
    updateImage() {
      var canvas = document.getElementById("preview");
      var img = canvas.toDataURL("image/png");
      document.getElementById('preview-img').src = img;
      document.getElementById('generated-prompt').style.display = "block";
      // document.getElementById('steps').style.display = "block";
      // document.getElementById('steps-prompt').style.display = "block";
      document.getElementById("add-to-github").style.display = "block";
    },
    githubupload() {
      let base64url = this.getBase64(document.getElementById("preview-img"));
      console.log(document.getElementById("preview-img").src);
      fetch('/addimage', {
        method: 'POST',
        body: JSON.stringify({ imgurl: base64url }),
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    }
  },
})

function save() {
  var canvas = document.getElementById("preview");
  var img = canvas.toDataURL("image/png");
  document.getElementById('preview-img').src = img;
}

// var base64 = getBase64Image(document.getElementById("imageid"));