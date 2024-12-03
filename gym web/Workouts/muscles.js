document.addEventListener("DOMContentLoaded", () => {
    var muscleMapObject = document.getElementById("musclemap");

    muscleMapObject.addEventListener("load", () => {
        var svgDoc = muscleMapObject.contentDocument;

        function muscleAction(muscleGroup, musclePage) {
            var muscles = svgDoc.querySelectorAll(`.${muscleGroup}`);
            muscles.forEach(muscle => {
                muscle.addEventListener("click", () => {
                    window.location.href = `/Workouts/${musclePage}.html`; // Redirect to the appropriate muscle page
                });

                muscle.addEventListener("mouseover", () => {
                    muscles.forEach(muscle => {
                        muscle.style.cursor = "pointer";
                        muscle.style.fill = '#ff6600';
                    })
                });
                muscle.addEventListener("mouseout", () => {
                    muscles.forEach(muscle => {
                        muscle.style.cursor = "default";
                        muscle.style.fill = '';
                    })
                });
            });
        }

        muscleAction('abdominal', 'SitUps');
        muscleAction('abductors', 'FireHydrants');
        muscleAction('adductors', 'stepUps');
        muscleAction('biceps', 'BicepsExtension');
        muscleAction('calves', 'LegRaises');
        muscleAction('chest', 'Push');
        muscleAction('forearms', 'forearms');
        muscleAction('glutes', 'GluteBridge');
        muscleAction('hamstrings', 'BodyweightSquat');
        muscleAction('lats', 'Pull');
        muscleAction('lowerback', 'Plank');
        muscleAction('neck', 'ShoulderTaps');
        muscleAction('obliques', 'SittingTwists');
        muscleAction('quads', 'Lunges');
        muscleAction('traps', 'ShoulderTaps');
        muscleAction('triceps', 'Benchddips');
        muscleAction('arms', 'ArmCircles');
        muscleAction('fullbody', 'BurpeesThrusts');
    });
});
