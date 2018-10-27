const projects = [
    {
        title: 'latitude',
        description: 'Alcohol bomb geodesic savant cartel gang plastic order-flow shrine market corrupted ablative network shanty town sensory realism. Tiger-team rifle augmented reality 3D-printed long-chain hydrocarbons render-farm math-sentient car office marketing Chiba tanto narrative physical j-pop. Systema carbon shanty town face forwards construct warehouse ablative grenade camera corrupted nano-rebar girl city. ',
        image: '../images/latitude_analysis.png',
    }
];

$.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "/projects",
    traditional: "true",
    data: JSON.stringify(projects),
    dataType: "json"
});






console.log(projects);