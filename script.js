const start = document.getElementById("start");
const stop = document.getElementById("stop");
const download = document.getElementById("download");
const video = document.querySelector("video");
let recorder, stream;

// Create an overlay element to show support message
const overlay = document.createElement("div");
overlay.id = "overlay";
overlay.style.position = "fixed";
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
overlay.style.color = "#fff";
overlay.style.display = "flex";
overlay.style.alignItems = "center";
overlay.style.justifyContent = "center";
overlay.style.fontSize = "24px";
overlay.style.zIndex = "1000";
overlay.style.visibility = "hidden"; // Hide the overlay initially
overlay.textContent = "Current build does not support screen sharing on this device or browser.";
document.body.appendChild(overlay);

async function startRecording() {
    try {
        // Check if screen sharing is supported
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            // Screen sharing for desktop
            stream = await navigator.mediaDevices.getDisplayMedia({
                audio: true,
                video: { mediaSource: "screen", displaySurface: "monitor" },
            });
        } else {
            // Show overlay if screen sharing is not supported
            overlay.style.visibility = "visible";
            return;
        }

        // Hide overlay if recording is successful
        overlay.style.visibility = "hidden";

        // Initialize MediaRecorder
        recorder = new MediaRecorder(stream, {
            mimeType: "video/webm",
        });

        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: chunks[0].type });
            video.src = URL.createObjectURL(blob);
        };

        recorder.start();
    } catch (error) {
        console.error("Error starting recording:", error);
        overlay.style.visibility = "visible";
        overlay.textContent = `Could not start recording: ${error.message}`;
    }
}

start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
    download.setAttribute("disabled", true);

    startRecording();
});

stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
    download.removeAttribute("disabled");

    if (recorder && recorder.state !== "inactive") {
        recorder.stop();
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});

download.addEventListener("click", () => {
    const link = document.createElement("a");
    link.style.display = "none";
    link.setAttribute("download", "video.webm");
    link.setAttribute("target", "_blank");
    link.href = video.src;
    document.body.appendChild(link);
    link.click();
    link.remove();
});

// Optional Darkmode Settings
const options = {
    bottom: '20px',
    right: '20px',
    left: 'unset',
    time: '0.5s',
    mixColor: '#fff',
    backgroundColor: '#fff',
    buttonColorDark: '#100f2c',
    buttonColorLight: '#fff',
    saveInCookies: false,
    label: '🌓',
    autoMatchOsTheme: false
};

const darkmode = new Darkmode(options);
darkmode.showWidget();
