////////////////////
// DEFAULT VALUES //
////////////////////

const defaultComplexity = 0.1;
const defaultContrast = 0.1;
const defaultColor = [123, 220, 181];

////////////////////////////
// this creates the BLOB  //
////////////////////////////

class Blob {
    constructor(targetNode) {
        // Set default blob settings.
        this.target = targetNode;
        this.complexity = defaultComplexity;
        this.contrast = defaultContrast;
        this.color = defaultColor.slice();

        // Initial render with default settings.
        this.draw();
    }

    draw() {
        // Compute color value from RBG array.
        let color = "#";
        for (const channel of this.color) {
            if (channel < 16) {
                color += "0";
            }
            color += channel.toString(16);
        }

        // Replace contents of target with SVG output.
        this.target.innerHTML = blobs({
            size: 375,
            complexity: this.complexity,
            contrast: this.contrast,
            color: color,
            seed: "1234",
        });
    }

    setComplexity(complexity) {
        this.complexity = 0.01 + 0.99 * complexity;
        this.draw();
    }

    setContrast(contrast) {
        this.contrast = contrast;
        this.draw();
    }

    setColorChannel(channel, value) {
        this.color[channel] = value;
        this.draw();
    }
}

const moodBlob = new Blob(document.getElementById("mood"));

//////////////////////////////////
// this controls the BLOB COLOR //
//////////////////////////////////

const gColorPicker = d3
    .select('div#slider-color-picker')
    .append('svg')
    .attr('width', 375)
    .attr('height', 200);

['red', 'green', 'blue'].forEach((label, i) => {
    const slider = d3
        .sliderBottom()
        .min(0)
        .max(255)
        .step(1)
        .width(300)
        .ticks(0)
        .default(defaultColor[i])
        .displayValue(false)
        .fill(label)
        .handle(
            d3
                .symbol()
                .type(d3.symbolCircle)
                .size(200)()
        )
        .on('onchange', (val) => {
            moodBlob.setColorChannel(i, val);
            console.log("color slider moved, color is now " + moodBlob.color);
        });

    gColorPicker
        .append('g')
        .attr('transform', `translate(37.5, ${40 + 60 * i})`)
        .call(slider);
});

//////////////////////////////////
// this controls the COMPLEXITY //
//////////////////////////////////

const gComplexityPicker = d3
    .sliderBottom()
    .min(0)
    .max(1)
    .width(300)
    .ticks(0)
    .default(defaultComplexity)
    .handle(
        d3
            .symbol()
            .type(d3.symbolCircle)
            .size(200)()
    )
    .on('onchange', (val) => {
        moodBlob.setComplexity(val);
        console.log("complexity slider moved, it is now " + val);
    });

const gComplexity = d3
    .select('div#slider-shape-picker')
    .append('svg')
    .attr('width', 375)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(37.5, 50)');

gComplexity.call(gComplexityPicker);

////////////////////////////////
// this controls the CONTRAST //
////////////////////////////////

const gContrastPicker = d3
    .sliderBottom()
    .min(0)
    .max(1)
    .width(300)
    .ticks(0)
    .default(defaultContrast)
    .handle(
        d3
            .symbol()
            .type(d3.symbolCircle)
            .size(200)()
    )
    .on('onchange', (val) => {
        moodBlob.setContrast(val);
        console.log("contrast slider moved, it is now " + val);
    });

const gContrast = d3
    .select('div#slider-shape-picker')
    .append('svg')
    .attr('width', 375)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(37.5, 50)');

gContrast.call(gContrastPicker);

//////////////////////////////////////
// this controls the STICKER DRAWER //
//////////////////////////////////////

const dragMoveListener = (event) => {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    const translate = `translate(${x}px, ${y}px)`;
    target.style.transform = translate;
    target.style.webkitTransform = translate;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

interact('.draggable')
    .draggable({
        inertia: true,
        autoScroll: true,
        onmove: dragMoveListener,
    });

interact('.dropzone').dropzone({
    accept: '.draggable',
    overlap: 0.75,

    ondropactivate: (event) => {
        event.target.classList.add('drop-active');
    },
    ondragenter: (event) => {
        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;

        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: (event) => {
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondropdeactivate: (event) => {
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    },
});

interact('.drag-drop')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrict({
                restriction: "parent",
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            }),
        ],
        autoScroll: true,
        onmove: dragMoveListener,
    });

//////////////////////////////////////////
// this controls the NAVIGATION BUTTONS //
//////////////////////////////////////////

const navColor = document.getElementById('color');
const navShape = document.getElementById('shape');
const navSticker = document.getElementById('sticker');

const colorSlider = document.getElementById('slider-color-picker');
const shapeSlider = document.getElementById('slider-shape-picker');
const stickerDrawer = document.getElementById('sticker-picker');

navShape.addEventListener("click", () => {
    if (navColor.style.display === "none") {
        navColor.style.display = "block";
    } else {
        navColor.style.display = "none";
    };

    if (navSticker.style.display === "none") {
        navSticker.style.display = "block";
    } else {
        navSticker.style.display = "none";
    };

    if (shapeSlider.style.display === "block") {
        shapeSlider.style.display = "none";
    } else {
        shapeSlider.style.display = "block";
    };

    console.log("shape icon was clicked");
});

navColor.addEventListener("click", () => {
    if (navShape.style.display === "none") {
        navShape.style.display = "block";
    } else {
        navShape.style.display = "none";
    };

    if (navSticker.style.display === "none") {
        navSticker.style.display = "block";
    } else {
        navSticker.style.display = "none";
    };

    if (colorSlider.style.display === "block") {
        colorSlider.style.display = "none";
    } else {
        colorSlider.style.display = "block";
    };

    console.log("color icon was clicked");
});

navSticker.addEventListener("click", () => {
    if (navColor.style.display === "none") {
        navColor.style.display = "block";
    } else {
        navColor.style.display = "none";
    };

    if (navShape.style.display === "none") {
        navShape.style.display = "block";
    } else {
        navShape.style.display = "none";
    };

    if (stickerDrawer.style.display === "block") {
        stickerDrawer.style.display = "none";
    } else {
        stickerDrawer.style.display = "block";
    };

    console.log("sticker icon was clicked");
});
