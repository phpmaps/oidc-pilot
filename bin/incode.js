window.onload = (event) => {
    const interviewId = document.getElementById('interviewId').value;
    const flow = JSON.parse(document.getElementById('interview').value);
    if (flow && flow?.id === interviewId && flow?.apiUrl && flow?.key && flow?.uid) {
        interval = setInterval(heartbeat, 2000, flow);
    }
};

const heartbeat = async (flow) => {
    const results = await doGet(flow);
    if (results.onboardingStatus === 'ONBOARDING_FINISHED') {
        setTimeout(() => {
            const interviewForm = document.getElementById('interviewForm');
            interviewForm.method = 'post';
            interviewForm.action = `/interaction/${flow.uid}/login`;
            interviewForm.submit();
        }, 6000)

    }
}

const doGet = (flow) => {
    const statusUrl = `${flow.apiUrl}/omni/get/onboarding/status?id=${flow.id}`;
    return fetch(statusUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Incode-Hardware-Id': flow.key,
            'api-version': '1.0'
        }
    })
        .then((response) => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
}
