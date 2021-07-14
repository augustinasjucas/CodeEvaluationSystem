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
}
