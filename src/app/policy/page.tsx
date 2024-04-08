import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import AppAppBar from '@/src/components/AppAppBar';
import Footer from '@/src/components/Footer';

export default function Index() {
  return (
    <>
      <AppAppBar />
      <Box sx={{
          bgcolor: 'background.default',
          pt: 15,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
      }}>
        <Box sx={{ mt: 3, mb: 10, width: { md: '1024px' } }}>
          <div className="space-y-2">
            <section>
              <h2 className="text-xl font-bold">Terms of Service</h2>
              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
                IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
                CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
                TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
                SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold">Privacy Policy</h2>
              <p>
                This site uses JSON Web Tokens and an in-memory database which resets
                every ~2 hours.
              </p>
              <p>
                Data provided to this site is exclusively used to support signing in
                and is not passed to any third party services, other than via SMTP or
                OAuth for the purposes of authentication.
              </p>
            </section>
          </div>
        </Box>
        <Divider />
        <Footer />
      </Box>
    </>
  )
}


