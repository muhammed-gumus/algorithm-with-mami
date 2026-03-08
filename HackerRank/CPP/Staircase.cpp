/*
 * HackerRank - Staircase
 *
 * Print a staircase of height n.
 * The staircase is right-aligned, composed of # symbols and spaces.
 * The last line is not preceded by any spaces.
 */

#include <bits/stdc++.h>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);

void staircase(int n) {
    for (int i = 1; i <= n; i++) {
        cout << string(n - i, ' ') << string(i, '#') << "\n";
    }
}

int main() {
    string n_temp;
    getline(cin, n_temp);
    int n = stoi(ltrim(rtrim(n_temp)));

    staircase(n);

    return 0;
}

string ltrim(const string &str) {
    string s(str);
    s.erase(s.begin(), find_if(s.begin(), s.end(), [](unsigned char c) {
        return !isspace(c);
    }));
    return s;
}

string rtrim(const string &str) {
    string s(str);
    s.erase(find_if(s.rbegin(), s.rend(), [](unsigned char c) {
        return !isspace(c);
    }).base(), s.end());
    return s;
}
