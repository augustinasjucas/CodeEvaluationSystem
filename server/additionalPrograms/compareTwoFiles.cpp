// g++ -std=c++17 -o comparison -O3 compareTwoFiles.cpp
/*#include <bits/stdc++.h>
#pragma GCC optimize("O3")
using namespace std;
int main(){
    bool match = 1;

    cin.tie(NULL);
    ios_base::sync_with_stdio(false);

    string first, second;
    cin >> first >> second;

    ifstream in1(first);
    ifstream in2(second);

    string a, b;

    while(true){
        if(in1.peek() == EOF){
            if(in2.peek() == EOF) break;
            match = 0;
            break;
        }
        in1 >> a; in2 >> b;
        if(a != b) {
            match = 0;
            break;
        }
    }
    if(match){
        cout << "Yes";
    }else{
        cout << "No";
    }
    in1.close();
    in2.close();

    return 0;
}*/

#include <bits/stdc++.h>
#pragma GCC optimize("O3")
using namespace std;
int main(){
    bool match = 1;

    cin.tie(NULL);
    ios_base::sync_with_stdio(false);

    string first, second;
    cin >> first >> second;

    ifstream in1(first);
    ifstream in2(second);

    char a = '\n', b = '\n';
    bool firstDone = 0;
    bool secondDone = 0;
    bool aTurn = 1;
    while(true) {
        if(firstDone && secondDone) break;
        if(aTurn){
            if(firstDone){
                a = '\n';
                aTurn = 0;
                continue;
            }
            firstDone = (in1.get(a) ? 0 : 1);
            if(a == ' ' || a == '\n') {
                aTurn = 1;
                continue;
            }
            aTurn = 0;
        }else{
            if(secondDone){
                b = '\n';
                aTurn = 1;
                continue;
            }
            secondDone = (in2.get(b) ? 0 : 1);
            if(b == ' ' || b == '\n') {
                aTurn = 0;
                continue;
            }
            aTurn = 1;
        }
        if(!secondDone && b == '\n') continue;
   //     cout << "'" << a << "' vs '" << b << "', paskui bus A eile = " << aTurn << endl;
        if(a != b){
            match = 0;
            break;
        }
        a = '\n';
        b = '\n';
        aTurn = 1;
    }
    if(match){
        cout << "Yes";
    }else{
        cout << "No";
    }
    in1.close();
    in2.close();

    return 0;
}
