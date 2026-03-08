/*
 * HackerRank - Time Conversion
 *
 * Given a time in 12-hour AM/PM format, convert it to 24-hour (military) time.
 *
 * Examples:
 *   12:00:00AM -> 00:00:00
 *   12:00:00PM -> 12:00:00
 *   07:05:45PM -> 19:05:45
 */

#include <bits/stdc++.h>
using namespace std;

string ltrim(const string &);
string rtrim(const string &);

string timeConversion(string s) {
    string period = s.substr(s.size() - 2); // "AM" or "PM"
    string time   = s.substr(0, s.size() - 2);

    int hh = stoi(time.substr(0, 2));
    string rest = time.substr(2); // ":MM:SS"

    if (period == "AM") {
        hh = (hh == 12) ? 0 : hh;
    } else {
        hh = (hh == 12) ? 12 : hh + 12;
    }

    char buf[3];
    snprintf(buf, sizeof(buf), "%02d", hh);
    return string(buf) + rest;
}

int main() {
    ofstream fout(getenv("OUTPUT_PATH"));

    string s;
    getline(cin, s);

    string result = timeConversion(s);
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
