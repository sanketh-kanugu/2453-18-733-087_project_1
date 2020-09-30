#include<stdio.h>
int main()
{
    int n; // Number of processess
    int m; // number of resourses
    int i,j,k;

    printf("Enter the Number of Processess Required: ");
    scanf("%d",&n);
    printf("\n");

    printf("Enter the Number of Resources Required: ");
    scanf("%d",&m);
    printf("\n");

    int avail[m]; //Available Resources
    int alloc[n][m];//Allocation Matrix
    int max[n][m];//MAX Matrix
    int need[n][m]; //Need Matrix

    printf("\n");
    printf("Enter the instances for resources\n");
    for(i = 0; i < m; i++)
    {
        scanf("%d",&avail[i]);
    }
    printf("\n");


    printf("Enter the Allocation Matrix\n");
    for (i = 0; i < n; i++)
    {
        for(j = 0; j < m; j++)
        {
            scanf("%d",&alloc[i][j]);
        }
    }
    printf("\n");


    printf("Enter the MAX Matrix\n");
     for (i = 0; i < n; i++)
    {
        for(j = 0; j < m; j++)
        {
            scanf("%d",&max[i][j]);
        }
    }
    printf("\n");


    int f[n],ans[n],ind = 0;
    for (k = 0; k < n; k++)
    {
        f[k] = 0;
    }
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++)
            need[i][j] = max[i][j] - alloc[i][j];
    }
    int y = 0;
    for (k = 0; k < n; k++) {
        for (i = 0; i < n; i++) {
            if (f[i] == 0) {

                int flag = 0;
                for (j = 0; j < m; j++) {
                    if (need[i][j] > avail[j]){
                        flag = 1;
                         break;
                    }
                }

                if (flag == 0) {
                    ans[ind++] = i;
                    for (y = 0; y < m; y++)
                        avail[y] += alloc[i][y];
                    f[i] = 1;
                }
            }
        }
    }
    printf("\n");
    printf("The Required SAFE Sequence is\n");
    for(i = 0; i < n - 1; i++)
    {
        printf(" P%d ->", ans[i]);
    }
    printf(" P%d",ans[n - 1]);

    return(0);
}
