#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>

using namespace std;

int INITIAL_TABLE_SIZE = 13;
double UPPER_LOAD_FACTOR = 0.5;
double LOWER_LOAD_FACTOR = 0.25;
int C1 = 1;
int C2 = 3;

bool isPrime(int n)
{
    if (n <= 1)
        return false;
    for (int i = 2; i * i <= n; i++)
    {
        if (n % i == 0)
            return false;
    }
    return true;
}

int getNextPrime(int n)
{
    int p = n + 1;
    while (!isPrime(p))
    {
        p++;
    }
    return p;
}

int getPrevPrime(int n)
{
    int p = n - 1;
    while (p > 1 && !isPrime(p))
    {
        p--;
    }
    return p;
}

int hash1(string key, int tableSize)
{
    long long hashVal = 0;
    long long p = 31;
    long long m = 1e9 + 9;
    long long p_pow = 1;
    for (char c : key)
    {
        hashVal = (hashVal + (c - 'a' + 1) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return (int)((hashVal % tableSize + tableSize) % tableSize);
}

int hash2(string key, int tableSize)
{
    unsigned int hashVal = 5381;
    for (char c : key)
    {
        hashVal = ((hashVal << 5) + hashVal) + c;
    }
    return (int)(hashVal % tableSize);
}

int auxHash(string key)
{
    int sum = 0;
    for (char c : key)
    {
        sum += c;
    }
    return (sum % 11) + 1;
}

struct Node
{
    string key;
    int value;
    Node *next;
    Node(string k, int v)
    {
        key = k;
        value = v;
        next = NULL;
    }
};

struct Slot
{
    string key;
    int value;
    bool isOccupied;
    bool isDeleted;
    Slot()
    {
        key = "";
        value = -1;
        isOccupied = false;
        isDeleted = false;
    }
};

class ChainingHashTable
{
    Node **table;
    int currentSize;
    int elementCount;
    int opsSinceResize;
    int sizeAtLastResize;

public:
    int totalCollisions;

    ChainingHashTable()
    {
        currentSize = INITIAL_TABLE_SIZE;
        elementCount = 0;
        opsSinceResize = 0;
        sizeAtLastResize = INITIAL_TABLE_SIZE;
        totalCollisions = 0;
        table = new Node *[currentSize];
        for (int i = 0; i < currentSize; i++)
            table[i] = NULL;
    }

    ~ChainingHashTable()
    {
        clearTable();
        delete[] table;
    }

    void clearTable()
    {
        for (int i = 0; i < currentSize; i++)
        {
            Node *curr = table[i];
            while (curr != NULL)
            {
                Node *temp = curr;
                curr = curr->next;
                delete temp;
            }
            table[i] = NULL;
        }
    }

    void resize(int newSize)
    {
        Node **oldTable = table;
        int oldSize = currentSize;

        currentSize = newSize;
        table = new Node *[currentSize];
        for (int i = 0; i < currentSize; i++)
            table[i] = NULL;

        elementCount = 0;
        for (int i = 0; i < oldSize; i++)
        {
            Node *curr = oldTable[i];
            while (curr != NULL)
            {
                insertWithoutResize(curr->key, curr->value, 1);
                Node *temp = curr;
                curr = curr->next;
                delete temp;
            }
        }
        delete[] oldTable;
        opsSinceResize = 0;
        sizeAtLastResize = elementCount;
    }

    bool search(string key, int hashType, int &hits)
    {
        int idx = (hashType == 1) ? hash1(key, currentSize) : hash2(key, currentSize);
        Node *curr = table[idx];
        hits = 0;
        while (curr != NULL)
        {
            hits++;
            if (curr->key == key)
                return true;
            curr = curr->next;
        }
        return false;
    }

    bool insertWithoutResize(string key, int value, int hashType)
    {
        int dummyHits = 0;
        if (search(key, hashType, dummyHits))
            return false;

        int idx = (hashType == 1) ? hash1(key, currentSize) : hash2(key, currentSize);

        if (table[idx] != NULL)
        {
            totalCollisions++;
        }

        Node *newNode = new Node(key, value);
        newNode->next = table[idx];
        table[idx] = newNode;
        elementCount++;
        return true;
    }

    bool insert(string key, int value, int hashType)
    {
        if (!insertWithoutResize(key, value, hashType))
            return false;

        opsSinceResize++;
        double loadFactor = (double)elementCount / currentSize;
        if (loadFactor > UPPER_LOAD_FACTOR && opsSinceResize >= sizeAtLastResize / 2)
        {
            int newSize = getNextPrime(2 * currentSize);
            resize(newSize);
        }
        return true;
    }
};

class ProbingHashTable
{
    Slot *table;
    int currentSize;
    int elementCount;
    int opsSinceResize;
    int sizeAtLastResize;
    int technique;

public:
    int totalCollisions;

    ProbingHashTable(int tech)
    {
        technique = tech;
        currentSize = INITIAL_TABLE_SIZE;
        elementCount = 0;
        opsSinceResize = 0;
        sizeAtLastResize = INITIAL_TABLE_SIZE;
        totalCollisions = 0;
        table = new Slot[currentSize];
    }

    ~ProbingHashTable()
    {
        delete[] table;
    }

    int getHashIndex(string key, int i, int hashType)
    {
        int h1 = (hashType == 1) ? hash1(key, currentSize) : hash2(key, currentSize);
        int aux = auxHash(key);

        if (technique == 1)
        {
            return (h1 + i * aux) % currentSize;
        }
        else
        {
            return (h1 + C1 * i * aux + C2 * i * i) % currentSize;
        }
    }

    void resize(int newSize, int hashType)
    {
        Slot *oldTable = table;
        int oldSize = currentSize;

        currentSize = newSize;
        table = new Slot[currentSize];

        elementCount = 0;
        for (int i = 0; i < oldSize; i++)
        {
            if (oldTable[i].isOccupied && !oldTable[i].isDeleted)
            {
                insertWithoutResize(oldTable[i].key, oldTable[i].value, hashType);
            }
        }
        delete[] oldTable;
        opsSinceResize = 0;
        sizeAtLastResize = elementCount;
    }

    bool search(string key, int hashType, int &hits)
    {
        hits = 0;
        for (int i = 0; i < currentSize; i++)
        {
            hits++;
            int idx = getHashIndex(key, i, hashType);
            if (!table[idx].isOccupied && !table[idx].isDeleted)
            {
                return false;
            }
            if (table[idx].isOccupied && table[idx].key == key)
            {
                return true;
            }
        }
        return false;
    }

    bool insertWithoutResize(string key, int value, int hashType)
    {
        int dummyHits = 0;
        if (search(key, hashType, dummyHits))
            return false;

        int firstIdx = getHashIndex(key, 0, hashType);
        if (table[firstIdx].isOccupied)
        {
            totalCollisions++;
        }

        for (int i = 0; i < currentSize; i++)
        {
            int idx = getHashIndex(key, i, hashType);
            if (!table[idx].isOccupied || table[idx].isDeleted)
            {
                table[idx].key = key;
                table[idx].value = value;
                table[idx].isOccupied = true;
                table[idx].isDeleted = false;
                elementCount++;
                return true;
            }
        }
        return false;
    }

    bool insert(string key, int value, int hashType)
    {
        if (!insertWithoutResize(key, value, hashType))
            return false;

        opsSinceResize++;
        double loadFactor = (double)elementCount / currentSize;
        if (loadFactor > UPPER_LOAD_FACTOR && opsSinceResize >= sizeAtLastResize / 2)
        {
            int newSize = getNextPrime(2 * currentSize);
            resize(newSize, hashType);
        }
        return true;
    }
};

string generateRandomWord(int length)
{
    string word = "";
    for (int i = 0; i < length; i++)
    {
        word += (char)('a' + rand() % 26);
    }
    return word;
}

int main()
{
    srand(time(0));

    int wordLength = 10;
    int numWords = 10000;
    vector<string> dataset;

    cout << "Generating " << numWords << " unique words..." << endl;
    while (dataset.size() < numWords)
    {
        string w = generateRandomWord(wordLength);
        bool duplicate = false;
        for (int i = 0; i < dataset.size(); i++)
        {
            if (dataset[i] == w)
            {
                duplicate = true;
                break;
            }
        }
        if (!duplicate)
        {
            dataset.push_back(w);
        }
    }

    ChainingHashTable chain1, chain2;
    ProbingHashTable doubleHash1(1), doubleHash2(1);
    ProbingHashTable customHash1(2), customHash2(2);

    for (int i = 0; i < numWords; i++)
    {
        chain1.insert(dataset[i], i + 1, 1);
        chain2.insert(dataset[i], i + 1, 2);

        doubleHash1.insert(dataset[i], i + 1, 1);
        doubleHash2.insert(dataset[i], i + 1, 2);

        customHash1.insert(dataset[i], i + 1, 1);
        customHash2.insert(dataset[i], i + 1, 2);
    }

    vector<string> searchSet;
    for (int i = 0; i < 1000; i++)
    {
        int idx = rand() % numWords;
        searchSet.push_back(dataset[idx]);
    }

    double hitsChain1 = 0, hitsChain2 = 0;
    double hitsDouble1 = 0, hitsDouble2 = 0;
    double hitsCustom1 = 0, hitsCustom2 = 0;

    int currentHits = 0;
    for (int i = 0; i < 1000; i++)
    {
        chain1.search(searchSet[i], 1, currentHits);
        hitsChain1 += currentHits;

        chain2.search(searchSet[i], 2, currentHits);
        hitsChain2 += currentHits;

        doubleHash1.search(searchSet[i], 1, currentHits);
        hitsDouble1 += currentHits;

        doubleHash2.search(searchSet[i], 2, currentHits);
        hitsDouble2 += currentHits;

        customHash1.search(searchSet[i], 1, currentHits);
        hitsCustom1 += currentHits;

        customHash2.search(searchSet[i], 2, currentHits);
        hitsCustom2 += currentHits;
    }

    cout << "\n-----------------------------------------------------------------------------------\n";
    cout << "                         |          Hash1          |          Hash2          \n";
    cout << "                         | Collisions | Avg Hits   | Collisions | Avg Hits   \n";
    cout << "-----------------------------------------------------------------------------------\n";
    cout << "Chaining Method          | " << chain1.totalCollisions << "      | " << hitsChain1 / 1000.0 << "     | " << chain2.totalCollisions << "      | " << hitsChain2 / 1000.0 << "\n";
    cout << "Double Hashing           | " << doubleHash1.totalCollisions << "      | " << hitsDouble1 / 1000.0 << "     | " << doubleHash2.totalCollisions << "      | " << hitsDouble2 / 1000.0 << "\n";
    cout << "Custom Probing           | " << customHash1.totalCollisions << "      | " << hitsCustom1 / 1000.0 << "     | " << customHash2.totalCollisions << "      | " << hitsCustom2 / 1000.0 << "\n";
    cout << "-----------------------------------------------------------------------------------\n";

    return 0;
}