const w = (path, size = 1280) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}/${size}px-${path.split("/").pop()}`;

export const regionImages = {
  assam: w("f/fe/Beauty_of_Kaziranga_National_Park.jpg"),
  meghalaya: w("5/55/Dawki_River%2C_Meghalaya%2C_India.jpg"),
  "arunachal-pradesh": w("9/9a/TawangMonastery-ArunachalPradesh-1.jpg"),
  nagaland: w("c/cb/Kapamodzu.jpg"),
  sikkim: w("5/5f/Gurudongmar_Lake_Sikkim%2C_India_%28edit%29.jpg"),
  manipur: w("3/34/Pumlenpat_Lake.jpg"),
  mizoram: w("1/1e/DowntownAizawl.png", 960),
  tripura: w("c/c8/Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg"),
};

export const placeImages = {
  Dibrugarh: w("2/29/Bogibeel_Bridge_view.jpg"),
  "Kaziranga National Park": w("f/fe/Beauty_of_Kaziranga_National_Park.jpg"),
  Majuli: w("c/cb/Doriya_River_of_Majuli.jpg"),
  Sivasagar: w("0/02/Sivasagar_Night_View.jpg"),
  Guwahati: w("1/11/Guwahati_citysky.jpg"),
  Shillong: w("a/ac/Elephant_Falls_II%2C_Shillong.jpg"),
  Cherrapunji: w("f/ff/Cherrapunji.jpg"),
  "Dawki and Mawlynnong": w("d/d9/Mawlynnong_-_Cleanest_village_of_Asia.jpg"),
  "Double Decker Root Bridge": w("5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg"),
  Tawang: w("9/92/TawangMonastery.jpg"),
  "Ziro Valley": w("1/1e/A_cross_section_of_luch_green_valley_of_Ziro.jpg"),
  "Namdapha National Park": w("2/23/Forest_snow_Namdapha_IMG_3373_04.jpg"),
  Kohima: w("a/ae/Capital_Cultural_Hall.jpg"),
  "Dzükou Valley": w("4/44/Breathtaking_beauty_of_Dzukou_Valley_in_Manipur-Nagaland_border_%28edit%29.jpg"),
  Mon: w("d/da/Mon-Nagaland-Jim-Ankan-Deka-photography.jpg"),
  Gangtok: w("9/99/Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok%2C_East_Sikkim_09.jpg"),
  Pelling: w("f/fa/Main_Shrine_of_Pemangytse_Gompa_with_prayer_flags.jpg"),
  "Loktak Lake": w("e/e9/The_Loktak_Lake.jpg"),
  Imphal: w("8/84/Imphal_At_Dusk.jpg"),
  Aizawl: w("1/1e/DowntownAizawl.png", 960),
  Agartala: w("c/c8/Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg"),
};
