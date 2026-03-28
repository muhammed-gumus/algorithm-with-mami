/*
 * HackerRank - Birthday Cake Candles
 *
 * You are in charge of the cake for a child's birthday.
 * Count how many candles are tallest — only those can be blown out.
 */

#include <bits/stdc++.h>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);
vector<string> split(const string &);

int birthdayCakeCandles(vector<int> candles) {
    int maxHeight = *max_element(candles.begin(), candles.end());
    return count(candles.begin(), candles.end(), maxHeight);
}

int main() {
    ofstream fout(getenv("OUTPUT_PATH"));

    string candles_count_temp;
    getline(cin, candles_count_temp);
    int candles_count = stoi(ltrim(rtrim(candles_count_temp)));

    string candles_temp_temp;
    getline(cin, candles_temp_temp);
    vector<string> candles_temp = split(rtrim(candles_temp_temp));
    vector<int> candles(candles_count);
    for (int i = 0; i < candles_count; i++) {
        candles[i] = stoi(candles_temp[i]);
    }

    int result = birthdayCakeCandles(candles);
    fout << result << "\n";

    fout.close();
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

vector<string> split(const string &str) {
    vector<string> tokens;
    string::size_type start = 0;
    string::size_type end = 0;
    while ((end = str.find(" ", start)) != string::npos) {
        tokens.push_back(str.substr(start, end - start));
        start = end + 1;
    }
    tokens.push_back(str.substr(start));
    return tokens;
}
