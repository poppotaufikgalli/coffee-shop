const video = document.getElementById('video');
const overlayCanvas = document.getElementById('overlayCanvas');
const captureButton = document.getElementById('captureButton');
const registrationForm = document.getElementById('registrationForm');
const photoDataInput = document.getElementById('photoData');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        //const blob = new Blob( [stream], { type: 'image/png' } );
        console.log(stream)
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });

captureButton.addEventListener('click', () => {
    const context = overlayCanvas.getContext('2d');
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, overlayCanvas.width, overlayCanvas.height);
    const photoDataUrl = overlayCanvas.toDataURL('image/jpeg');
    photoDataInput.value = photoDataUrl;
    console.log('Captured photo data:', photoDataUrl); // Debug log
});

registrationForm.addEventListener('submit', (e) => {
    if (photoDataInput.value === '') {
        e.preventDefault();
        alert('Please capture a photo before submitting the form.');
    }
});

async function loadModels() {
    const MODEL_URL = '/models';
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

async function loadLabeledImages() {
    const labels = await fetch('/get-ids').then(res => res.json());
    return Promise.all(
        labels.map(async label => {
            const imgUrl = `/dataset/${label}.jpg`;
            const img = await faceapi.fetchImage(imgUrl);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (!detections) {
                throw new Error(`No face detected for ${label}`);
            }
            return new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]);
        })
    );
}

const detectionCounts = {}; // Object to keep track of face detection counts

let faceMatcher = null

video.addEventListener('canplay', async () => {
    await loadModels(); // Load models here before doing any face detection
    
    const labeledFaceDescriptors = await loadLabeledImages(); // Load labeled face data for comparison

    if(labeledFaceDescriptors.length > 0){
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5); // Create face matcher with tolerance 0.6
    }

    overlayCanvas.width = video.videoWidth; // Adjust canvas width to match video width
    overlayCanvas.height = video.videoHeight; // Adjust canvas height to match video height
    console.log(overlayCanvas, video.videoWidth)

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors(); // Detect all faces with landmarks and descriptors
        const resizedDetections = faceapi.resizeResults(detections, {
            width: video.videoWidth,
            height: video.videoHeight
        }); // Resize detection results to match video size

        const context = overlayCanvas.getContext('2d');
        context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height); // Clear canvas before drawing detection results

        //untuk menampilkan score akurasi
        faceapi.draw.drawDetections(overlayCanvas, resizedDetections);
        //untuk menampilkan titik-titik 68
        resizedDetections.forEach(detection => {
            faceapi.draw.drawFaceLandmarks(overlayCanvas, detection); // Gambar titik-titik landmark
        });

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor)); // Match each face detection with labeled data
        results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box; // Get face detection box
            const { label, distance } = result; // Get label and match distance from result

            // Update detection count for the label
            if (!detectionCounts[label]) {
                detectionCounts[label] = 0;
            }
            detectionCounts[label]++;

            // Draw detection box
            context.strokeStyle = '#ff0000';
            context.lineWidth = 2;
            context.strokeRect(box.x, box.y, box.width, box.height);

            // Set custom font for label
            context.font = '24px Helvetica'; // Change font size and type here
            context.fillStyle = '#00ffd0';

            // Determine label text
            let labelText = label;
            if (detectionCounts[label] > 15) {
                labelText = '★★★'; // 3 stars if detected more than 15 times
            } else if (detectionCounts[label] > 10) {
                labelText = '★★'; // 2 stars if detected more than 10 times
            } else if (detectionCounts[label] > 5) {
                labelText = '★'; // 1 star if detected more than 5 times
            }
            context.fillText(labelText, box.x, box.y - 10); // Draw label text above the detection box

            if (label !== 'siapa_ya') {
                fetch(`/user-info/${label}`) // Fetch user info based on face label
                    .then(response => response.json())
                    .then(user => {
                        if (user) {
                            // Set custom font for user info
                            context.font = '24px Helvetica'; // Change font size and type here
                            context.fillStyle = '#00ffd0';
                            context.fillText(`${user.nama} (${user.jabatan})`, box.x, box.y + box.height + 30); // Draw user info text below the detection box
                        }
                    });
            }
        });
    }, 1000); // Repeat detection every 1000 milliseconds (1 second)
});