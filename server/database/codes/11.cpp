#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

int main(){
    int N, M, K;
    cin >> N >> M >> K;

    // skaičiavimai su a, x, y gali siekti iki 4*10^9, taigi į paprastą int netelpa
    vector<unsigned int> a(2*M+1), x(2*M+1), y(2*K);
    for(int i = 0; i < M; i++)
        cin >> x[i] >> a[i];
    for(int i = 0; i < K; i++)
        cin >> y[i];
    
    // padarom dvi apskritimo kopijas, kad galėtumėm apie apskritimą galvoti kaip apie tiesę
    for(int i = 0; i < M; i++)
        x[i+M] = x[i] + N, a[i+M] = a[i];
    for(int i = 0; i < K; i++)
        y[i+K] = y[i] + N;

    // nukopijuojame dar vieną robotą, kad būtų už paskutinės sienos
    x[2*M] = x[0] + 2*N;
    a[2*M] = a[0];

    // čia saugosime galutines robotų koordinates
    vector<int> atsakymas(M);
    if(K == 0){ // be sienų
        // randam roboto su didžiausia komanda indeksą
        // nuo jo pradėsim skaičiavimus
        int pirmas = distance(a.begin(), max_element(a.begin(), a.end()));

        // žymi sekciją, į kurią atsistojo paskutinis nagrinėtas robotas
        unsigned int paskutine_poz = -1;
        for(int i = pirmas; i < M + pirmas; i++){
            // robotas i paeina iki x[i] + a[i] ir dar galimai pastumiamas iki paskutine_poz + 1
            paskutine_poz = max(paskutine_poz + 1, x[i] + a[i]);
            atsakymas[i % M] = (paskutine_poz - 1) % N + 1;
        }
    }
    else{ // su sienom
        // pirmo nenagrinėto roboto indeksas
        int pirmas = 0;
        for(int i = 0; i < K; i++){
            // nagrinėsim robotus tarp kairės ir dešinės sienų
            unsigned int kaire_siena = y[i], desine_siena = y[i+1];
            // surandam pirmą robotą, kur stovi už kairės sienos
            while(x[pirmas] < kaire_siena)pirmas++; 
            // surandam pirmą robotą, kur stovi už dešinės sienos
            int paskutinis = pirmas;
            while(x[paskutinis] < desine_siena)paskutinis++;

            // žymi, kiek dar robotų reikia surasti galutines pozicijas tarp kaire_siena ir desine_siena
            int kiekis = paskutinis - pirmas;

            // žymi sekciją, į kurią atsistojo paskutinis nagrinėtas robotas
            unsigned int paskutine_poz = kaire_siena;
            for(int j = pirmas; j < paskutinis; j++){
                // robotas j paeina iki x[j] + a[j] ir dar galimai pastumiamas
                // iki paskutine_poz + 1, bet ne toliau nei desine_siena - kiekis, 
                // kad paliktumėm vietos likusiems robotams
                paskutine_poz = min(max(x[j] + a[j], paskutine_poz + 1), desine_siena - kiekis);
                kiekis -= 1;
                atsakymas[j % M] = (paskutine_poz - 1) % N + 1;
            }
            pirmas = paskutinis;
        }
    }   

    for(int pozicija: atsakymas){
        cout << pozicija << " ";
    }
    cout << endl;
}
