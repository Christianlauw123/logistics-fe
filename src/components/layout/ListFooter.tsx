import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  data: {
    last_page?: number;
    [key: string]: any; // Allows other API properties to exist without breaking types
  } | undefined | null;
}

const ListPaginationFooter: React.FC<PaginationProps> = ({ page, setPage, data }) => {
    const lastPage = data?.last_page || 1;
    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {page} of {lastPage}
            </p>

            <div className="space-x-2">
                <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((value) => value - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    disabled={!data || page >= lastPage}
                    onClick={() => setPage((value) => value + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export {
    ListPaginationFooter
}