document.addEventListener("DOMContentLoaded", () => {
    // === 오디오 매니저 설정 ===
    const audioPlaza = document.getElementById('bgm-plaza');
    const audioDialog = document.getElementById('bgm-dialog');
    const audioMinigame = document.getElementById('bgm-minigame');
    const audioReward = document.getElementById('bgm-reward');
    let currentBGM = null;
    let audioUnlocked = false;

    function playBGM(newAudio) {
        if (currentBGM === newAudio) return;
        
        let oldAudio = currentBGM;
        currentBGM = newAudio;

        if (oldAudio) {
            let vol = oldAudio.volume;
            let fadeOut = setInterval(() => {
                vol -= 0.05;
                if (vol <= 0) {
                    clearInterval(fadeOut);
                    oldAudio.pause();
                    oldAudio.currentTime = 0;
                } else {
                    oldAudio.volume = vol;
                }
            }, 50);
        }

        if (newAudio && audioUnlocked) {
            newAudio.volume = 0;
            let playPromise = newAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    let vol = 0;
                    let fadeIn = setInterval(() => {
                        vol += 0.05;
                        if (vol >= 1) {
                            clearInterval(fadeIn);
                            newAudio.volume = 1;
                        } else {
                            newAudio.volume = vol;
                        }
                    }, 50);
                }).catch(e => console.log("Audio play blocked by browser:", e));
            }
        }
    }

    const unlockAudio = () => {
        if (!audioUnlocked) {
            audioUnlocked = true;
            playBGM(audioPlaza); 
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        }
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio, { passive: true });

    // === UI 요소 참조 ===
    const titleLogo = document.getElementById('title-logo');
    const startBtn = document.getElementById('start-btn');
    const titleScene = document.getElementById('title-scene');
    const bgVideo = document.getElementById('bg-video');
    const sceneContainer = document.getElementById('scene-container');
    const charLayer = document.getElementById('character-layer');
    
    const dialogLayer = document.getElementById('dialog-layer');
    const tigerChar = document.getElementById('tiger-char');
    const dialogText = document.getElementById('dialog-text');
    const arrowLeft = document.getElementById('arrow-left');
    const arrowRight = document.getElementById('arrow-right');
    const mainStartBtn = document.getElementById('main-start-btn');
    
    const quizBtnContainer = document.getElementById('quiz-btn-container');
    const quizBtnA = document.getElementById('quiz-btn-a');
    const quizBtnB = document.getElementById('quiz-btn-b');
    const minigameStartBtn = document.getElementById('minigame-start-btn');

    const minigameLayer = document.getElementById('minigame-layer');
    const minigameCloseBtn = document.getElementById('minigame-close-btn');
    const winOverlay = document.getElementById('win-overlay');
    const unlockedLayer = document.getElementById('unlocked-layer');

    const infoDialogLayer = document.getElementById('info-dialog-layer');
    const infoDialogText = document.getElementById('info-dialog-text');
    const infoArrowLeft = document.getElementById('info-arrow-left');
    const infoArrowRight = document.getElementById('info-arrow-right');
    const compareBtn = document.getElementById('compare-btn');

    const sceneImageLayer = document.getElementById('scene-image-layer');
    const activeSceneImage = document.getElementById('active-scene-image');
    
    const candidateDialogLayer = document.getElementById('candidate-dialog-layer');
    const candidatePortraitImg = document.getElementById('candidate-portrait-img');
    const candidateCharacterName = document.getElementById('candidate-character-name');
    const candidateDialogText = document.getElementById('candidate-dialog-text');
    const candidateArrowLeft = document.getElementById('candidate-arrow-left');
    const candidateArrowRight = document.getElementById('candidate-arrow-right');

    const globalBackBtn = document.getElementById('global-back-btn');

    let isGamePaused = false; 
    let activeDialogType = null; 

    let minigameState = {
        activePatient: null, 
        offsetX: 0, offsetY: 0, 
        successCount: 0, 
        totalPatients: 3 
    };

    setTimeout(() => titleLogo.classList.add('fade-in'), 3000);
    setTimeout(() => startBtn.classList.add('fade-in'), 4000);

    // 스타트 버튼 
    startBtn.addEventListener('click', () => {
        playBGM(audioDialog); 
        titleScene.style.transition = 'opacity 0.5s ease';
        titleScene.style.opacity = '0';

        setTimeout(() => {
            titleScene.style.display = 'none';
            bgVideo.pause(); 
            sceneContainer.style.display = 'block';

            characterData.forEach(data => {
                const img = document.createElement('img');
                img.src = data.url; img.alt = data.name; img.className = 'game-character';
                img.style.left = `${data.x}px`; img.style.bottom = `${data.y}px`;
                charLayer.appendChild(img);
            });

            setTimeout(() => {
                document.querySelectorAll('.game-character').forEach(char => char.classList.add('appear'));

                setTimeout(() => {
                    isGamePaused = true;
                    activeDialogType = 'tiger';
                    sceneContainer.classList.add('frost-glass');
                    globalBackBtn.style.display = 'block'; 
                    
                    dialogLayer.style.display = 'block'; 
                    setTimeout(() => {
                        dialogLayer.style.opacity = '1'; 
                        tigerChar.classList.add('appear-dialog');
                        updateDialog(); 
                    }, 50);
                }, 4000); 
            }, 1000); 
        }, 500); 
    });

    const characterData = [
        { name: "파이낸셜", x: 63, y: 51, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%ED%8C%8C%EC%9D%B4%EB%82%B8%EC%85%9C_ecbboj.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%ED%8C%8C%EC%9D%B4%EB%82%B8%EC%85%9C_ecbboj.png" },
        { name: "임산부", x: 210, y: 76, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EC%9E%84%EC%82%B0%EB%B6%80_pjgqmr.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282628/%EC%9E%84%EC%82%B0%EB%B6%80_%ED%98%B8%EB%B2%84_ids2yd.png" },
        { name: "법관", x: 368, y: 129, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EB%B2%95%EA%B4%80_h6jrkj.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EB%B2%95%EA%B4%80_%ED%98%B8%EB%B2%84_oylhq8.png" },
        { name: "군인", x: 378, y: 15, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EA%B5%B0%EC%9D%B8_ayt9r0.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EA%B5%B0%EC%9D%B8_%ED%98%B8%EB%B2%84_ts48pf.png" },
        { name: "간호사", x: 508, y: 126, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EA%B0%84%ED%98%B8%EC%82%AC_ww0zqk.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EA%B0%84%ED%98%B8%EC%82%AC_%ED%98%B8%EB%B2%84_a19blt.png" },
        { name: "직장인", x: 565, y: 46, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EC%A7%81%EC%9E%A5%EC%9D%B8_x42up1.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282628/%EC%A7%81%EC%9E%A5%EC%9D%B8_%ED%98%B8%EB%B2%84_lwzc3k.png" },
        { name: "경찰", x: 668, y: 99, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EA%B2%BD%EC%B0%B0_v3pdoo.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EA%B2%BD%EC%B0%B0_%ED%98%B8%EB%B2%84_qzljiy.png" },
        { name: "교사", x: 740, y: 160, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EA%B5%90%EC%82%AC_fxwacg.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EA%B5%90%EC%82%AC_%ED%98%B8%EB%B2%84_a1ynhz.png" },
        { name: "로봇", x: 809, y: 26, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EB%A1%9C%EB%B4%87_dkymhk.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282627/%EB%A1%9C%EB%B4%87_%ED%98%B8%EB%B2%84_q0ftm3.png" },
        { name: "케이팝", x: 942, y: 124, url: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282552/%EC%BC%80%EC%9D%B4%ED%8C%9D_osgzsn.png", hoverUrl: "https://res.cloudinary.com/dq40bwfal/image/upload/v1775282628/%EC%BC%80%EC%9D%B4%ED%8C%9D_%ED%98%B8%EB%B2%84_a04dtw.png" }
    ];

    const transcripts = [
        "Hi there! I'm the Horang, your guide to this plaza!",
        "This is Seoul Plaza, where the hearts of our nation gather.",
        "See all the different citizens over there?",
        "Every single one of them is a vital part of our society.",
        "Now, let’s take it step by step.",
        "Try clicking on the people in the plaza one by one.",
        "You’ll see what promises the two candidates, Lee and Kim, made.",
        "Once you’ve read through the pledges, a quiz will wait for you.",
        "If you get it right, fun mini-game will unlock as a reward,",
        "allowing you to peek deeper into their lives -- don't miss out!",
        "Voting with full understanding of our society is truly rewarding!",
        "Now, shall we head out to meet the main characters?"
    ];

    const nurseTranscripts = [
        "The biggest challenge in Korea's public health is the staff shortage.",
        "The government is trying to increase the number of doctors,",
        "but the medical side emphasizes doctor's quality, leading to a standoff.",
        "Due to the doctors' strike, many are dying without seeing a doctor.",
        "Will the next president really be able to solve this problem?"
    ];

    const leeTranscripts = [
        "Hello. I am Lee Jae-yong, candidate number 1 from the Democratic Party.",
        "Empty hospitals and delayed surgeries are a sad result.",
        "It happens when a government pushes forward without listening.",
        "I will not just increase the number of doctors blindly.",
        "I will train 'local doctors' who will stay in our rural towns.",
        "We will build state-run medical schools for dedicated doctors.",
        "Doctors who prioritize neighbors' lives over making a profit.",
        "No more wandering between emergency rooms or waiting in lines.",
        "The state will take full responsibility for essential treatments.",
        "We will bring the public and experts together for dialogue.",
        "We will decide on a fair and reasonable number without fighting.",
        "A government must ensure you get treated wherever you live.",
        "I will make sure your basic right to health is protected."
    ];

    const kimTranscripts = [
        "Hello. I am Kim Kang-min, candidate number 2 from the Conservative Party.",
        "I deeply understand your anxiety when hospital doors are closed.",
        "I will re-examine all the failed policies from the very beginning.",
        "I will listen directly to the medical students and young doctors.",
        "I'll create a way for them to return to their patients with pride.",
        "I won't make you wait any longer. I will act immediately.",
        "I will launch a 6-month plan to normalize hospitals upon taking office.",
        "Rather than forcing numbers, I will improve the working environment.",
        "So doctors actually want to work in rural towns and difficult fields.",
        "I will grow our world-class medical skills into a global industry.",
        "This will bring in foreign visitors and help our economy grow.",
        "We will stop treating doctors like criminals and respect them.",
        "We will solve this through conversation to ease your worries."
    ];

    const quizRewardTranscripts = [
        "Excellent! That's the correct answer!",
        "You've shown a great understanding of the public health pledges.",
        "As a reward, I'll unlock a fun mini-game for you!",
        "After enjoying the game, you can explore the next character.",
        "Let's play!"
    ];

    const sceneImageUrls = [
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776048742/Scene1_lpvih2.png",
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776048743/Scene2_eeq529.png",
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776048744/Scene3_v8sxmh.png",
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776048746/Scene_4_oifhma.png",
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776048748/Scene5_josflr.png"
    ];

    const leeSceneImages = [
        null, null, null, null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057714/Pledge_1_i0ebe1.png", 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057715/Pledge1_1_ru4ja1.png", 
        null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057721/Pledge_1_3_svkbwv.png", 
        null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057722/Pledge_1_4_ygtub7.png", 
        null, null, null  
    ];

    const kimSceneImages = [
        null, null, null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057726/Pledge_2_2_s8jeal.png", 
        null, null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057729/Pledge_2_4_xr5af5.png", 
        null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057724/Pledge_2_lv2mwu.png", 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057728/Pledge_2_3_oduzai.png", 
        null, 
        "https://res.cloudinary.com/dq40bwfal/image/upload/v1776057726/Pledge_2_2_s8jeal.png", 
        null  
    ];

    const leePortraitSrc1 = "https://res.cloudinary.com/dq40bwfal/image/upload/v1776051111/Lee1_n4i7yh.png";
    const leePortraitSrc2 = "https://res.cloudinary.com/dq40bwfal/image/upload/v1776051111/Lee2_knd7er.png";
    const kimPortraitSrc1 = "https://res.cloudinary.com/dq40bwfal/image/upload/v1776051111/Kim1_us4qid.png";
    const kimPortraitSrc2 = "https://res.cloudinary.com/dq40bwfal/image/upload/v1776051111/Kim2_ymkxbt.png";

    let currentDialogIndex = 0;
    let currentNurseIndex = 0;
    let currentCandidateIndex = 0; 
    let currentCandidateDialogIndex = 0; 
    let currentActiveImageSrc = ""; 
    let currentQuizRewardIndex = 0;

    globalBackBtn.addEventListener('click', () => {
        if (activeDialogType === 'tiger') closeTigerDialog();
        else if (activeDialogType === 'nurse') closeNurseDialog(false); 
        else if (activeDialogType === 'candidate') closeCandidateDialog();
        else if (activeDialogType === 'minigame') closeMinigame(); 
    });

    // ==========================================
    // 호랑이 튜토리얼 로직
    // ==========================================
    function closeTigerDialog() {
        dialogLayer.style.opacity = '0'; 
        setTimeout(() => {
            dialogLayer.style.display = 'none';
            sceneContainer.classList.remove('frost-glass');
            mainStartBtn.style.display = 'none';
            globalBackBtn.style.display = 'none';
            activeDialogType = null;
            
            playBGM(audioPlaza); 
            startRoaming();
        }, 300);
    }
    
    mainStartBtn.addEventListener('click', closeTigerDialog);

    function updateDialog() {
        dialogText.innerText = transcripts[currentDialogIndex];
        
        if (currentDialogIndex === 0) arrowLeft.classList.add('hidden');
        else arrowLeft.classList.remove('hidden');

        if (currentDialogIndex === transcripts.length - 1) {
            arrowRight.classList.add('hidden');
            mainStartBtn.style.display = 'block'; 
        } else {
            arrowRight.classList.remove('hidden');
            mainStartBtn.style.display = 'none';
        }
    }

    arrowLeft.addEventListener('click', () => {
        if (activeDialogType === 'tiger') {
            if (currentDialogIndex > 0) { currentDialogIndex--; updateDialog(); }
        } else if (activeDialogType === 'quiz_reward') {
            if (currentQuizRewardIndex > 0) { currentQuizRewardIndex--; updateQuizRewardDialog(); }
        }
    });

    arrowRight.addEventListener('click', () => {
        if (activeDialogType === 'tiger') {
            if (currentDialogIndex < transcripts.length - 1) { currentDialogIndex++; updateDialog(); }
        } else if (activeDialogType === 'quiz_reward') {
            if (currentQuizRewardIndex < quizRewardTranscripts.length - 1) { currentQuizRewardIndex++; updateQuizRewardDialog(); }
        }
    });

    // ==========================================
    // 호랑이 퀴즈 및 보상 로직
    // ==========================================
    function startQuizSequence() {
        activeDialogType = 'quiz';
        sceneContainer.classList.add('frost-glass');
        playBGM(audioDialog); 
        
        arrowLeft.classList.add('hidden');
        arrowRight.classList.add('hidden');
        mainStartBtn.style.display = 'none';
        minigameStartBtn.style.display = 'none';
        
        dialogText.innerText = "What is the biggest challenge in Korea's public health mentioned by the Nurse?";
        
        dialogLayer.style.display = 'block';
        quizBtnContainer.style.display = 'flex'; 
        
        setTimeout(() => dialogLayer.style.opacity = '1', 50);
    }

    quizBtnA.addEventListener('click', () => {
        quizBtnContainer.style.display = 'none';
        activeDialogType = 'quiz_reward';
        currentQuizRewardIndex = 0;
        updateQuizRewardDialog();
    });

    quizBtnB.addEventListener('click', () => {
        dialogText.innerText = "Hmm, that's not quite right. Try again!\nWhat is the biggest challenge in Korea's public health?";
    });

    function updateQuizRewardDialog() {
        dialogText.innerText = quizRewardTranscripts[currentQuizRewardIndex];
        
        if (currentQuizRewardIndex === 0) arrowLeft.classList.add('hidden');
        else arrowLeft.classList.remove('hidden');

        if (currentQuizRewardIndex === quizRewardTranscripts.length - 1) {
            arrowRight.classList.add('hidden');
            minigameStartBtn.style.display = 'block'; 
        } else {
            arrowRight.classList.remove('hidden');
            minigameStartBtn.style.display = 'none';
        }
    }

    minigameStartBtn.addEventListener('click', openMinigame);

    // ==========================================
    // 트리아지 미니게임 로직 
    // ==========================================
    function openMinigame() {
        dialogLayer.style.opacity = '0';
        setTimeout(() => {
            dialogLayer.style.display = 'none';
            minigameStartBtn.style.display = 'none';
        }, 300);

        activeDialogType = 'minigame';
        minigameState.successCount = 0;
        winOverlay.classList.add('hidden');
        resetPatients();

        playBGM(audioMinigame); 

        minigameLayer.style.display = 'block';
        setTimeout(() => {
            minigameLayer.style.opacity = '1';
            initTriageGame(); 
        }, 10);
    }

    function closeMinigame() {
        minigameLayer.style.opacity = '0';
        winOverlay.classList.add('hidden'); 
        unlockedLayer.style.opacity = '0';
        setTimeout(() => { unlockedLayer.style.display = 'none'; }, 300);

        setTimeout(() => {
            minigameLayer.style.display = 'none';
            sceneContainer.classList.remove('frost-glass');
            activeDialogType = null;
            removeTriageEventListeners(); 
            
            playBGM(audioPlaza); 
            startRoaming(); 
        }, 300);
    }

    minigameCloseBtn.addEventListener('click', closeMinigame);

    function resetPatients() {
        const patients = document.querySelectorAll('.draggable-patient');
        const initialPositions = {
            'patient-stretcher': { left: '10%', bottom: '10%' },
            'patient-bandage': { left: '40%', bottom: '10%' },
            'patient-bboy': { left: '65%', bottom: '10%' }
        };
        patients.forEach(p => {
            p.style.left = initialPositions[p.id].left;
            p.style.top = ''; 
            p.style.bottom = initialPositions[p.id].bottom;
            p.classList.remove('is-dropped-correct', 'hidden', 'is-dragging');
            p.style.pointerEvents = 'auto'; 
        });
        document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('zone-hover'));
    }

    function initTriageGame() {
        const patients = document.querySelectorAll('.draggable-patient');
        patients.forEach(patient => {
            patient.addEventListener('mousedown', onDragStart);
            patient.addEventListener('touchstart', onDragStart, { passive: false });
        });

        window.addEventListener('mousemove', onDragMove, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchend', onDragEnd);
    }

    function removeTriageEventListeners() {
        const patients = document.querySelectorAll('.draggable-patient');
        patients.forEach(patient => {
            patient.removeEventListener('mousedown', onDragStart);
            patient.removeEventListener('touchstart', onDragStart);
        });
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchend', onDragEnd);
    }

    function onDragStart(e) {
        if (activeDialogType !== 'minigame') return;
        
        if (e.type === 'mousedown') { e.preventDefault(); }
        
        const event = e.type.startsWith('touch') ? e.touches[0] : e;
        const patient = e.currentTarget;
        
        if (patient.classList.contains('is-dropped-correct')) return;

        minigameState.activePatient = patient;
        
        const gameArea = document.getElementById('minigame-game-area');
        const patientRect = patient.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();

        const startLeft = patientRect.left - gameAreaRect.left;
        const startTop = patientRect.top - gameAreaRect.top;

        patient.style.left = `${startLeft}px`;
        patient.style.top = `${startTop}px`;
        patient.style.bottom = 'auto';
        
        patient.classList.add('is-dragging');

        minigameState.offsetX = event.clientX - patientRect.left;
        minigameState.offsetY = event.clientY - patientRect.top;
    }

    function onDragMove(e) {
        if (!minigameState.activePatient || activeDialogType !== 'minigame') return;

        const event = e.type.startsWith('touch') ? e.touches[0] : e;
        const patient = minigameState.activePatient;
        const gameArea = document.getElementById('minigame-game-area');
        const gameAreaRect = gameArea.getBoundingClientRect();

        let newX = event.clientX - gameAreaRect.left - minigameState.offsetX;
        let newY = event.clientY - gameAreaRect.top - minigameState.offsetY;

        patient.style.left = `${newX}px`;
        patient.style.top = `${newY}px`;

        checkDropZoneHover(patient);
        if (e.cancelable) e.preventDefault(); 
    }

    function onDragEnd(e) {
        if (!minigameState.activePatient) return;
        
        const patient = minigameState.activePatient;
        patient.classList.remove('is-dragging');

        document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('zone-hover'));

        checkTriageMatch(patient);
        minigameState.activePatient = null;
    }

    function checkDropZoneHover(patient) {
        const zones = document.querySelectorAll('.drop-zone');
        zones.forEach(zone => {
            if (isOverlapping(patient, zone)) zone.classList.add('zone-hover');
            else zone.classList.remove('zone-hover');
        });
    }

    function isOverlapping(patientEl, zoneEl) {
        const pRect = patientEl.getBoundingClientRect();
        const zRect = zoneEl.getBoundingClientRect();
        const pCenterX = pRect.left + pRect.width / 2;
        const pCenterY = pRect.top + pRect.height / 2;
        
        return (pCenterX >= zRect.left && pCenterX <= zRect.right &&
                pCenterY >= zRect.top && pCenterY <= zRect.bottom);
    }

    function checkTriageMatch(patient) {
        const correctZoneId = `zone-${patient.dataset.correctZone}`;
        const correctZone = document.getElementById(correctZoneId);

        if (isOverlapping(patient, correctZone)) {
            patient.classList.add('is-dropped-correct'); 
            patient.style.pointerEvents = 'none'; 
            minigameState.successCount++;

            if (minigameState.successCount === minigameState.totalPatients) {
                triggerRewardSequence();
            }
        } else {
            const initialPositions = {
                'patient-stretcher': { left: '10%', bottom: '10%' },
                'patient-bandage': { left: '40%', bottom: '10%' },
                'patient-bboy': { left: '65%', bottom: '10%' }
            };
            patient.style.left = initialPositions[patient.id].left;
            patient.style.top = '';
            patient.style.bottom = initialPositions[patient.id].bottom;
        }
    }

    function triggerRewardSequence() {
        playBGM(audioReward); 

        // 1. 성공 이미지 오버레이 (SUCCEED 텍스트 삭제됨)
        winOverlay.classList.remove('hidden'); 
        setTimeout(() => { winOverlay.style.opacity = '1'; }, 10);

        // 2. 3초 후 미니게임 창 닫고 언락 화면 띄움
        setTimeout(() => {
            minigameLayer.style.opacity = '0';
            setTimeout(() => {
                minigameLayer.style.display = 'none';
                
                unlockedLayer.style.display = 'block';
                setTimeout(() => { unlockedLayer.style.opacity = '1'; }, 50);

                // 3. 언락 화면 5초 후 광장 복귀
                setTimeout(() => {
                    unlockedLayer.style.opacity = '0';
                    setTimeout(() => {
                        unlockedLayer.style.display = 'none';
                        sceneContainer.classList.remove('frost-glass');
                        activeDialogType = null;
                        removeTriageEventListeners(); 
                        
                        playBGM(audioPlaza); 
                        startRoaming(); 
                    }, 300);
                }, 5000);
                
            }, 300);
        }, 3000);
    }

    // ==========================================
    // 간호사 대화창 로직
    // ==========================================
    function updateNurseDialog() {
        infoDialogText.innerText = nurseTranscripts[currentNurseIndex];
        let sceneImgIdx = Math.min(currentNurseIndex, sceneImageUrls.length - 1);
        activeSceneImage.src = sceneImageUrls[sceneImgIdx]; 
        
        sceneImageLayer.style.display = 'block';
        setTimeout(() => sceneImageLayer.style.opacity = '1', 10);

        if (currentNurseIndex === 0) infoArrowLeft.classList.add('hidden');
        else infoArrowLeft.classList.remove('hidden');

        if (currentNurseIndex === nurseTranscripts.length - 1) {
            compareBtn.classList.remove('hidden');
            compareBtn.style.display = 'block';
            infoArrowRight.classList.add('hidden');
        } else {
            compareBtn.classList.add('hidden');
            compareBtn.style.display = 'none';
            infoArrowRight.classList.remove('hidden');
        }
    }

    function openNurseDialog() {
        isGamePaused = true;
        activeDialogType = 'nurse';
        playBGM(audioDialog); 
        sceneContainer.classList.add('frost-glass');
        globalBackBtn.style.display = 'block'; 
        
        currentNurseIndex = 0;
        updateNurseDialog();
        
        infoDialogLayer.style.display = 'block';
        setTimeout(() => infoDialogLayer.style.opacity = '1', 50);
    }

    function closeNurseDialog(openCandidate = false) {
        infoDialogLayer.style.opacity = '0';
        sceneImageLayer.style.opacity = '0';
        compareBtn.style.display = 'none';
        
        setTimeout(() => {
            infoDialogLayer.style.display = 'none';
            sceneImageLayer.style.display = 'none';
            
            if(openCandidate) {
                openCandidateDialog();
            } else {
                sceneContainer.classList.remove('frost-glass');
                globalBackBtn.style.display = 'none'; 
                isGamePaused = false;
                activeDialogType = null;
                playBGM(audioPlaza); 
                startRoaming();
            }
        }, 300);
    }

    infoArrowLeft.addEventListener('click', () => {
        if (currentNurseIndex > 0) { currentNurseIndex--; updateNurseDialog(); }
    });

    infoArrowRight.addEventListener('click', () => {
        if (currentNurseIndex < nurseTranscripts.length - 1) { currentNurseIndex++; updateNurseDialog(); }
    });

    compareBtn.addEventListener('click', () => { closeNurseDialog(true); });

    // ==========================================
    // 대통령 후보 공약 대화창 로직
    // ==========================================
    function updateCandidateDialog() {
        let currentTranscripts = currentCandidateIndex === 0 ? leeTranscripts : kimTranscripts;
        let currentImages = currentCandidateIndex === 0 ? leeSceneImages : kimSceneImages;
        
        candidateDialogText.innerText = currentTranscripts[currentCandidateDialogIndex];

        if (currentCandidateDialogIndex === 0) candidateArrowLeft.classList.add('hidden');
        else candidateArrowLeft.classList.remove('hidden');

        candidateArrowRight.classList.remove('hidden'); 

        let newImgUrl = currentImages[currentCandidateDialogIndex];
        
        if (newImgUrl) {
            activeSceneImage.src = newImgUrl;
            sceneImageLayer.style.display = 'block';
            setTimeout(() => { sceneImageLayer.style.opacity = '1'; }, 10);
        } else {
            sceneImageLayer.style.opacity = '0';
        }

        if (currentCandidateIndex === 0) { 
            if (currentCandidateDialogIndex >= 6) candidatePortraitImg.src = leePortraitSrc2;
            else candidatePortraitImg.src = leePortraitSrc1;
        } else { 
            if (currentCandidateDialogIndex >= 3) candidatePortraitImg.src = kimPortraitSrc2;
            else candidatePortraitImg.src = kimPortraitSrc1;
        }
    }

    function openCandidateDialog() {
        activeDialogType = 'candidate';
        currentCandidateIndex = 0; 
        currentCandidateDialogIndex = 0;
        candidateCharacterName.innerText = "Lee";
        playBGM(audioDialog); 
        
        updateCandidateDialog();
        
        candidateDialogLayer.style.display = 'block';
        setTimeout(() => { candidateDialogLayer.style.opacity = '1'; }, 50);
    }

    function closeCandidateDialog() {
        candidateDialogLayer.style.opacity = '0';
        sceneImageLayer.style.opacity = '0';
        setTimeout(() => {
            candidateDialogLayer.style.display = 'none';
            sceneImageLayer.style.display = 'none';
            globalBackBtn.style.display = 'none'; 
            
            startQuizSequence(); 
        }, 300);
    }

    function switchCandidate() {
        currentCandidateIndex = 1; 
        currentCandidateDialogIndex = 0;
        candidateCharacterName.innerText = "Kim";
        candidatePortraitImg.src = kimPortraitSrc1;
        
        sceneImageLayer.style.opacity = '0';
        
        updateCandidateDialog(); 
    }

    candidateArrowLeft.addEventListener('click', () => {
        if (currentCandidateDialogIndex > 0) {
            currentCandidateDialogIndex--;
            updateCandidateDialog();
        }
    });

    candidateArrowRight.addEventListener('click', () => {
        let currentTranscripts = currentCandidateIndex === 0 ? leeTranscripts : kimTranscripts;

        if (currentCandidateDialogIndex < currentTranscripts.length - 1) {
            currentCandidateDialogIndex++;
            updateCandidateDialog();
        } else {
            if (currentCandidateIndex === 0) switchCandidate(); 
            else closeCandidateDialog(); 
        }
    });

    // ==========================================
    // 캐릭터 이동 로직 
    // ==========================================
    let roamingChars = [];
    const BOUNDS = { minX: 30, maxX: 1040, minY: 15, maxY: 200 }; 

    function startRoaming() {
        isGamePaused = false; 
        if (roamingChars.length > 0) return; 

        const domChars = document.querySelectorAll('.game-character');
        domChars.forEach((el, index) => {
            const charObj = {
                el: el, x: parseFloat(el.style.left), y: parseFloat(el.style.bottom),
                targetX: parseFloat(el.style.left), targetY: parseFloat(el.style.bottom),
                speed: 0.2 + Math.random() * 0.3, state: 'idle', timer: Math.random() * 100,
                facingRight: true, flipCooldown: 0, isHovered: false, 
                normalSrc: characterData[index].url, hoverSrc: characterData[index].hoverUrl
            };

            el.addEventListener('mouseenter', () => {
                if(isGamePaused) return; 
                charObj.isHovered = true; el.src = charObj.hoverSrc; el.classList.add('pulse-effect'); 
            });

            el.addEventListener('mouseleave', () => {
                charObj.isHovered = false; el.src = charObj.normalSrc; el.classList.remove('pulse-effect'); 
                if(!charObj.facingRight) el.style.transform = 'scaleX(-1)';
                else el.style.transform = 'scaleX(1)';
            });

            el.addEventListener('click', () => {
                if (characterData[index].name === "간호사" && !isGamePaused) {
                    openNurseDialog();
                }
            });

            roamingChars.push(charObj);
        });
        requestAnimationFrame(roamLoop);
    }

    function roamLoop() {
        if (isGamePaused) { requestAnimationFrame(roamLoop); return; }

        roamingChars.forEach(c => {
            if (c.isHovered) return;
            if (c.flipCooldown > 0) c.flipCooldown--;

            if (c.state === 'idle') {
                c.timer--;
                if (c.timer <= 0) {
                    c.targetX = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX);
                    c.targetY = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY);
                    c.state = 'moving';
                }
            } else if (c.state === 'moving') {
                let dx = c.targetX - c.x, dy = c.targetY - c.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < 5) {
                    c.state = 'idle'; c.timer = 90 + Math.random() * 150; 
                } else {
                    let vx = (dx / dist) * c.speed, vy = (dy / dist) * c.speed;

                    roamingChars.forEach(other => {
                        if (c !== other) {
                            let odx = c.x - other.x, ody = c.y - other.y;
                            let odist = Math.sqrt(odx*odx + ody*ody);
                            if (odist < 80) { vx += (odx / odist) * 0.3; vy += (ody / odist) * 0.3; }
                        }
                    });

                    c.x += vx; c.y += vy;
                    c.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, c.x));
                    c.y = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, c.y));
                    c.el.style.left = `${c.x}px`; c.el.style.bottom = `${c.y}px`;
                    c.el.style.zIndex = 1000 - Math.floor(c.y);

                    if (c.flipCooldown <= 0) {
                        if (vx < -0.15 && c.facingRight) {
                            c.el.style.transform = 'scaleX(-1)'; c.facingRight = false; c.flipCooldown = 30; 
                        } else if (vx > 0.15 && !c.facingRight) {
                            c.el.style.transform = 'scaleX(1)'; c.facingRight = true; c.flipCooldown = 30;
                        }
                    }
                }
            }
        });
        requestAnimationFrame(roamLoop);
    }
});