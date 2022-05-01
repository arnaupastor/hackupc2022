const express = require("express");
const router = express.Router();
const {sql} = require(`../db.js`);
const motos = require(`./motos.json`)

let users;
// --------------------------
// GET API
// --------------------------

const MAX_DIST = 10;
// TODO; const MAX_ITERATIONS = 6;
const MAX_ITERATIONS = 3;

var index_fin;

function getRandomCentroids(k) {
    const numSamples = users.length;
    const centroidsIndex = [];
    let index;
    while (centroidsIndex.length < k) {
        index = randomBetween(0, numSamples);
        if (centroidsIndex.indexOf(index) === -1) {
            centroidsIndex.push(index);
        }
    }

    //console.log(`centroids index: ${centroidsIndex}`)

    centroids = [];
    for (let i = 0; i < centroidsIndex.length; i++) {
        const centroid = users[centroidsIndex[i]];
        //console.log(`centroid: ${centroid.user_id}`)
        centroids.push(centroid);
    }

    return centroids;
}


function exists(user, moto_id) {
    for (let i = 0; i < user.visits.length; i++) {
        if (user.visits[i].moto_id === moto_id) return i;
    }
    return -1;
}

// Calculate Squared Euclidean Distance
function getDistanceSQ(a, b) {

    let coincidencias = 0;

    for (let i = 0; i < a.visits.length; i++) {
        let b_index = exists(b, a.visits[i].moto_id)
        if (b_index != -1) {
            ++coincidencias;
        }
    }

    if (coincidencias == 0) {
        return MAX_DIST
    } else {
        return 1 / coincidencias;
    }

}

// Returns a label for each piece of data in the users.
function getLabels(centroids) {
    // prep data structure:
    const labels = [];
    for (let c = 0; c < centroids.length; c++) {
        labels[c] = {
            points: [],
            centroid: centroids[c],
        };
    }
    // For each element in the users, choose the closest centroid.
    // Make that centroid the element's label.
    for (let i = 0; i < users.length; i++) {
        const a = users[i];
        let closestCentroid, closestCentroidIndex, prevDistance;
        for (let j = 0; j < centroids.length; j++) {
            let centroid = centroids[j];
            if (j === 0) {
                closestCentroid = centroid;
                closestCentroidIndex = j;
                prevDistance = getDistanceSQ(a, closestCentroid);
                //console.log(`distance between: ${a.user_id} and ${closestCentroid.user_id} = ${prevDistance}`)
            } else {
                // get distance:
                const distance = getDistanceSQ(a, centroid);
                //console.log(`distance between: ${a.user_id} and ${centroid.user_id} = ${distance}`)
                if (distance < prevDistance) {
                    prevDistance = distance;
                    closestCentroid = centroid;
                    closestCentroidIndex = j;
                }
            }
        }
        // add point to centroid labels:
        if (labels[closestCentroidIndex] && labels[closestCentroidIndex].points)
            labels[closestCentroidIndex].points.push(a);
    }
    return labels;
}


function exists_visitMean(llista, moto_id) {
    for (let i = 0; i < llista.length; i++) {
        if (llista[i].moto_id === moto_id) return i;
    }
    return -1;
}

function getPointsMean(pointList) {
    const clusterUsers = pointList.length;
    const visitsMean = [];

    for (let i = 0; i < pointList.length; i++) {
        const point = pointList[i];
        for (let j = 0; j < point.visits.length; j++) {

            let index = exists_visitMean(visitsMean, point.visits[j].moto_id)
            if (index === -1) {
                visitsMean.push({
                    moto_id: point.visits[j].moto_id,
                    visits: point.visits[j].visits
                })
            } else {
                visitsMean[index] += point.visits[j].visits
            }
        }
    }

    for (let k = 0; k < visitsMean.length; k++) {
        visitsMean[k] /= clusterUsers
    }

    ++index_fin

    return {
        user_id: index_fin - 1,
        visits: visitsMean
    };
}

function recalculateCentroids(labels, k) {
    // Each centroid is the geometric mean of the points that
    // have that centroid's label. Important: If a centroid is empty (no points have
    // that centroid's label) you should randomly re-initialize it.
    let newCentroid;
    const newCentroidList = [];
    for (const k in labels) {
        const centroidGroup = labels[k];
        if (centroidGroup.points && centroidGroup.points.length > 0) {
            // find mean:
            newCentroid = getPointsMean(centroidGroup.points)

        } else {
            // get new random centroid
            newCentroid = getRandomCentroids(1)[0];
        }
        newCentroidList.push(newCentroid);
    }
    return newCentroidList;
}

function randomBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    );
}

function compareCentroids(a, b) {

    if (a.visits.length != b.visits.length) return false;

    for (let i = 0; i < a.visits.length; i++) {
        if (a.visits[i].visits !== b.visits[i].visits) {
            return false;
        }
    }
    return true;
}

function shouldStop(oldCentroids, centroids, iterations) {
    if (iterations > MAX_ITERATIONS) {
        return true;
    }
    if (!oldCentroids || !oldCentroids.length) {
        return false;
    }
    /*
    let sameCount = true;
    for (let i = 0; i < centroids.length; i++) {
      if (!compareCentroids(centroids[i], oldCentroids[i])) {
        sameCount = false;
      }
    }
    return sameCount;*/
}


function kmeans(k) {
    if (users.length && users[0].visits.length && users.length > k) {
        // Initialize book keeping variables
        let iterations = 0;
        let oldCentroids, labels, centroids;
        index_fin = users.length;

        // Initialize centroids randomly

        centroids = getRandomCentroids(k);

        // Run the main k-means algorithm
        while (!shouldStop(oldCentroids, centroids, iterations)) {
            // Save old centroids for convergence test.
            oldCentroids = [...centroids];
            iterations++;

            // Assign labels to each datapoint based on centroids
            labels = getLabels(centroids);


            centroids = recalculateCentroids(labels, k);
        }

        const clusters = [];
        for (let i = 0; i < k; i++) {
            clusters.push(labels[i]);
        }
        const results = {
            clusters: clusters,
            centroids: centroids,
            iterations: iterations,
            converged: iterations <= MAX_ITERATIONS,
        };
        return results;
    } else {
        throw new Error('Invalid users');
    }
}


router.get("/collaborative",
    async (req, res) => {


        const data = await sql.any(`SELECT *
                                    FROM visits`)

        const dataObj = {};

        data.forEach(d => {
            const obj = {
                "moto_id": d.moto_id,
                "visits": d.visits
            };

            if (!dataObj[d.user_id])
                dataObj[d.user_id] = {
                    visits: [obj]
                };
            else {
                dataObj[d.user_id].visits.push(obj)
            }
        })

        users = Object.keys(dataObj).map(user_id => {
            return {
                user_id: user_id,
                visits: dataObj[user_id].visits
            }
        })

        //console.log(users)
        //res.send({});
        //return;


        const results = kmeans(5)

        let cluster_user_one = {
            points: []
        };
        let breaking = false

        const clusters_resultantes = results.clusters

        for (let k = 0; !breaking && k < clusters_resultantes.length; ++k) {
            for (let l = 0; !breaking && l < clusters_resultantes[k].points.length; l++) {
                //console.log(`point ${clusters_resultantes[k].points[l].user_id} in cluster of centroid: ${clusters_resultantes[k].centroid.user_id}`);
                if (clusters_resultantes[k].points[l].user_id == 1) {
                    //console.log("FOUND!!")
                    cluster_user_one = clusters_resultantes[k]
                    breaking = true
                }
            }
            //console.log(clusters_resultantes[k])
        }


        let best_bikes = {};


        if (cluster_user_one.points) {
            for (let i = 0; i < cluster_user_one.points.length; ++i) {
                for (let j = 0; j < cluster_user_one.points[i].visits.length; ++j) {
                    if (cluster_user_one.points[i].user_id != 1) {
                        let id_moto = cluster_user_one.points[i].visits[j].moto_id;
                        let visits_moto = cluster_user_one.points[i].visits[j].visits;


                        if (!(best_bikes[id_moto])) {
                            best_bikes[id_moto] = visits_moto;
                        } else {
                            let old_value = best_bikes[id_moto];
                            best_bikes[id_moto] = visits_moto + old_value;

                        }
                    }
                }
            }
        }

        const sorted_bikes = Object.entries(best_bikes).sort((a, b) => b[1] - a[1]).map(b => b[0]);
        const result = sorted_bikes.splice(0, 24);


        let foundAll = false, i = 0;
        const finalResult = [];
        while (!foundAll && i < motos.length) {
            const moto = motos[i];
            result.forEach(r => {
                if (moto.id == r) {
                    finalResult.push(moto);
                    if (finalResult.length === result.length)
                        foundAll = true
                }
            })
            i++;
        }


        res.send(finalResult);
    });


module.exports = router;
